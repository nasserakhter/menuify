import chalk from "chalk";

export async function storePage({ buffer, alert, cursor, readkey, consolekeys }) {
    //await alert("Disclaimer", "Current menu's do not support downloading dependencies, if a menu requires a certain program to be installed, you must install it yourself. Note: This store is currently in beta, you may experience bugs and or other flaws.", ["Okay"]);

    String.prototype.realLength = function () {
        return this.replace(/\x1B\[[0-9;]*?m(?:DA)*/g, "").length;
    }
    buffer.secondary();
    buffer.clear();

    /*await waitVisual(100, 3000, {
        cursor, readkey, consolekeys
    });*/
    buffer.clear();

    let featuredMenus = getFeaturedMenus();
    let isRunning = true;

    while (isRunning) {
        buffer.clear();
        let vw = process.stdout.columns;
        let vh = process.stdout.rows;
        let width = Math.min(200, vw);
        let height = Math.min(50, vh);

        let cWidth = Math.max(0, width - 2);
        let cHeight = Math.max(0, height - 4);

        let cBuffer = await renderContent(cWidth, cHeight, featuredMenus);
        await renderWindow({
            buffer, cursor, readkey, consolekeys, width, height
        }, cBuffer);
        cursor.home();
        cursor.hide();
        let key = await readkey(true);
        switch (key) {
            case consolekeys.sigint:
                isRunning = false;
                break;
        }
    }

    process.stdin.setRawMode(true);
    buffer.primary();
    cursor.show();
}

function s(str, wid) {
    let length = str.realLength();
    return str + " ".repeat(Math.max(0, wid - length));
}

async function renderContent(width, height, featuredMenus) {
    let rBuffer = [];

    rBuffer.push(s(chalk.cyan.bold("yooo"), width));
    for (let i = 0; i < featuredMenus.length; i++) {

    }

    return rBuffer;
}

function realSubstring(str, start, end) {
    let escapeRegex = /\x1B\[[0-9;]*?m(?:DA)*/g;
    let text = str.replaceAll(escapeRegex, "");
    let truncated = text.substring(start, end);
    console.dir(text)
    console.dir(truncated)
    console.dir(str)
    console.dir(str.replace(text, truncated))
    return str.replaceAll(text, truncated);
}

async function renderWindow({ height, width }, cBuffer) {
    /*
╭──────────╮
│         │
├──────────┤
╰──────────╯
    */
    let minimize = "-";
    let maximize = "\u25A1";
    let close = "x";

    let vw = process.stdout.columns;
    let vh = process.stdout.rows;

    let rBuffer = "";
    let x = width === vw ? 0 : Math.floor((vw - width) / 2);
    let y = height === vh ? 0 : Math.floor((vh - height) / 2);
    rBuffer += "\n".repeat(Math.max(0, y - 1));

    for (let y = 0; y < height; y++) {
        let addNl = true;
        let bBuffer = "";
        if (y === 0) {
            bBuffer += "╭" + "─".repeat(width - 2) + "╮";
        } else if (y === 1) {
            let title = "Menuify Store - Featured";
            let rw = Math.max(0, Math.floor((width - 2 - title.length) / 2));
            bBuffer += "│" + " ".repeat(rw) + title + " ".repeat(Math.max(0, rw - 6)) + chalk.gray(minimize + " " + maximize + " " + close) + " │";
        } else if (y === 2) {
            bBuffer += "├" + "─".repeat(width - 2) + "┤";
        } else if (y === height - 1) {
            bBuffer += "╰" + "─".repeat(width - 2) + "╯";
            addNl = false;
        } else {
            let content = cBuffer[y - 3];
            if (y > 2 && content) {
                content = realSubstring(content, 0, 2);
                bBuffer += "│" + content + "│";
            } else {
                bBuffer += "│" + " ".repeat(width - 2) + "│";
            }
        }

        if (addNl)
            bBuffer += "\n";

        rBuffer += " ".repeat(x) + bBuffer;
    }

    //process.stdout.write(rBuffer);
}

function getFeaturedMenus() {
    return [
        {
            name: "shrink",
            id: "5e8d1a8f-f8f8-4f8e-b8f8-f8f8f8f8f8f8",
            description: "Library of functions to shrink a video to different sizes",
            ext: "mp4",
            cascade: true,
            buttons: [
                "720p crf 50 30fps",
                "720p crf 50 60fps",
                "720p crf 35 60fps",
                "1080p crf 50 30fps",
                "1080p crf 25 60fps",
                "1440p crf 25 60fps"
            ]
        },
        {
            name: "JPG to PNG",
            id: "415973f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8",
            description: "Library of functions to convert an JPG to PNG",
            ext: "jpg",
            cascade: false,
            buttons: [
                "Convert to PNG"
            ]
        },
        {
            name: "PNG to JPG",
            id: "415973f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8",
            description: "Library of functions to convert a PNG to JPG",
            ext: "png",
            cascade: false,
            buttons: [
                "Convert to JPG"
            ]
        }
    ];
}

async function waitVisual(speed = 100, length = 2000, { cursor, readkey, consolekeys }) {
    let loading = true;

    let animIndex = 0;
    //let animFrames = ['|', '/', '-', '\\'];
    // alt does not uses slashes, instead it uses fancy unicode characters
    // braille anim frames
    let animFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

    let f = (key) => {
        if (key === consolekeys.sigint) {
            loading = false;
        } else {
            readkey().then(f);
        }
    }

    readkey().then(f);

    setTimeout(() => {
        loading = false;
    }, length);

    while (loading) {
        cursor.home();
        cursor.hide();
        let anim = animFrames[animIndex];
        process.stdout.write(chalk.cyan(anim + " Contacting Microart servers"));
        await new Promise(resolve => setTimeout(resolve, speed));

        if (animIndex >= animFrames.length - 1) {
            animIndex = 0;
        } else {
            animIndex++;
        }
    }
}