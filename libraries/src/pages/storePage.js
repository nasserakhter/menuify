import chalk from "chalk";

export async function storePage({ inquirer, buffer, alert, cursor, readkey, consolekeys }) {
    //await alert("Disclaimer", "Current menu's do not support downloading dependencies, if a menu requires a certain program to be installed, you must install it yourself. Note: This store is currently in beta, you may experience bugs and or other flaws.", ["Okay"]);

    String.prototype.realLength = function () {
        return this.replace(/\x1B\[[0-9;]*?m(?:DA)*/g, "").length;
    }
    buffer.secondary();
    buffer.clear();

    await waitVisual(100, 800, {
        cursor, readkey, consolekeys, text: "Loading store page"
    });
    buffer.clear();

    let featuredMenus = getFeaturedMenus();
    let isRunning = true;
    let highlight = featuredMenus.length > 0 ? 1 : 0;

    let vfocus = 0;
    let vfocusMin = 0;
    let vfocusMax = 1;

    let searchInput = "Search...";
    let searchInputFirstTime = true;

    let editSearchBox = false;
    let performSearch = false;

    let sortBy = "";

    while (isRunning) {
        buffer.clear();
        let vw = process.stdout.columns;
        let vh = process.stdout.rows;
        let width = Math.min(100, vw);
        let height = Math.min(50, vh);

        let cWidth = Math.max(0, width - 2);
        let cHeight = Math.max(0, height - 4);

        if (performSearch) {
            performSearch = false;
            await waitVisual(100, 300, {
                cursor, readkey, consolekeys, text: "Searching, please wait..."
            });
            buffer.clear();
            highlight = 1;
        }

        let cBuffer = await renderContent({
            width: cWidth,
            height: cHeight,
            featuredMenus,
            focus: highlight,
            vfocus,
            searchInput,
            editSearchBox
        });
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
            case consolekeys.down:
                highlight = Math.min(featuredMenus.length, highlight + 1);
                editSearchBox = false;
                break;
            case consolekeys.up:
                highlight = Math.max(0, highlight - 1);
                editSearchBox = false;
                break;
            case consolekeys.left:
                vfocus = Math.max(vfocusMin, vfocus - 1);
                editSearchBox = false;
                break;
            case consolekeys.right:
                vfocus = Math.min(vfocusMax, vfocus + 1);
                editSearchBox = false;
                break;
            case consolekeys.enter:
                if (highlight === 0) {
                    if (vfocus === 0) {
                        if (editSearchBox) {
                            editSearchBox = false;
                            performSearch = true;
                        } else {
                            editSearchBox = true;
                            if (searchInputFirstTime) {
                                searchInputFirstTime = false;
                                searchInput = "";
                            }
                        }
                    } else if (vfocus === 1) {
                        buffer.clear();
                        let { sort } = await inquirer.prompt({
                            type: "list",
                            name: "sort",
                            message: "Sort by:",
                            choices: [
                                { name: "Name", value: "name" },
                                { name: "Extension", value: "ext" },
                                { name: "Cascading", value: "cascade" }
                            ]
                        });
                        sortBy = sort;
                    }
                }
                break;
            default:
                if (key.match(/^[a-zA-Z0-9 ]$/) || key === consolekeys.backspaceWin) {
                    if (editSearchBox) {
                        if (key === consolekeys.backspaceWin) {
                            searchInput = searchInput.substring(0, searchInput.length - 1);
                        } else {
                            searchInput += key;
                        }
                    }
                }
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

async function renderContent({ width, height, featuredMenus, focus, vfocus, searchInput, editSearchBox }) {
    let rBuffer = [];
    //let minSearchWidth = Math.max(25, searchInput.realLength());
    let minSearchWidth = 25;

    // unicode elipsis: \u2026

    let textDisplay;

    if (editSearchBox) {
        if (searchInput.length > minSearchWidth - 2) {
            searchInput = "\u2026" + searchInput.slice(Math.max(0, searchInput.length - (minSearchWidth - 4)));
        }
        if (focus === 0 && vfocus === 0) {
            textDisplay = chalk.underline.yellow(searchInput);
            textDisplay += chalk.yellow("\u258f");
        }
    } else {
        searchInput = searchInput.substring(0, minSearchWidth - 4);
        if (focus === 0 && vfocus === 0) {
            textDisplay = chalk.cyan(searchInput);
        } else {
            textDisplay = searchInput;
        }
    }

    let textBoxT = "╭" + "─".repeat(minSearchWidth) + "╮";
    let textBoxM = "│ø" + " " + textDisplay + " ".repeat(Math.max(0, minSearchWidth - 2 - textDisplay.realLength())) + "│";
    let textBoxB = "╰" + "─".repeat(minSearchWidth) + "╯";

    textBoxM += " ";
    let filterDisp = "\u25bc" + " Filters";
    if (focus === 0 && vfocus === 1) filterDisp = chalk.cyan(filterDisp);
    textBoxM += filterDisp;

    rBuffer.push(s(textBoxT, width));
    rBuffer.push(s(textBoxM, width));
    rBuffer.push(s(textBoxB, width));
    rBuffer.push(s("", width));

    let highlight = focus - 1;

    featuredMenus.forEach((menu, i) => {
        let tBuffer = [];
        let name = s(menu.name, 20) + " | " + menu.ext + " " + chalk.gray(menu.id);
        let desc = menu.description;
        let btns = "Contains " + menu.buttons.length + " button" + (menu.buttons.length === 1 ? "" : "s");
        let max = Math.max(name.realLength(), desc.realLength(), btns.realLength());
        let padding = 1;

        let unused = Math.min(max, width - max - (padding * 2));

        let marginLeft = Math.ceil(unused / 2);
        let marginRight = Math.floor(unused / 2);

        let spacer = " ".repeat(padding + max + padding - 2);
        let ogSpacer = spacer;

        name = name + " ".repeat(Math.max(0, max - name.realLength()));
        desc = desc + " ".repeat(Math.max(0, max - desc.realLength()));
        btns = btns + " ".repeat(Math.max(0, max - btns.realLength()));

        name = " ".repeat(padding) + name + " ".repeat(padding);
        desc = " ".repeat(padding) + desc + " ".repeat(padding);
        btns = " ".repeat(padding) + btns + " ".repeat(padding);


        let spacerT = " ".repeat(marginLeft) + " " + spacer + " " + " ".repeat(marginRight);
        let spacerB = " ".repeat(marginLeft) + " " + spacer + " " + " ".repeat(marginRight);

        if (i === highlight) {
            name = chalk.bgWhite.black(name);
            desc = chalk.bgWhite.black(desc);
            btns = chalk.bgWhite.black(btns);
            spacerT = " ".repeat(marginLeft) + "▟" + chalk.bgWhite.black(spacer) + "▙" + " ".repeat(marginRight);
            spacerB = " ".repeat(marginLeft) + "▜" + chalk.bgWhite.black(spacer) + "▛" + " ".repeat(marginRight);
        }

        name = " ".repeat(marginLeft) + name + " ".repeat(marginRight);
        desc = " ".repeat(marginLeft) + desc + " ".repeat(marginRight);
        btns = " ".repeat(marginLeft) + btns + " ".repeat(marginRight);


        spacer = " ".repeat(marginLeft) + " " + spacer + " " + " ".repeat(marginRight);

        tBuffer.push(s(spacerT, width));
        tBuffer.push(s(name, width));
        tBuffer.push(s(desc, width));
        tBuffer.push(s(btns, width));
        tBuffer.push(s(spacerB, width));
        if (i !== highlight)
            tBuffer.push(" ".repeat(marginLeft + padding) + "-".repeat(max) + " ".repeat(marginRight + padding));
        else
            tBuffer.push(s(spacer, width));

        rBuffer = rBuffer.concat(tBuffer);
    });

    if (featuredMenus.length === 0) {
        rBuffer.push(" ".repeat(width));
        let text = chalk.red("No menu's found");
        let marginLeft = Math.floor((width - text.realLength()) / 2);
        rBuffer.push(s(" ".repeat(marginLeft) + text, width));
    }

    return rBuffer;
}


async function renderWindow({ height, width }, cBuffer) {
    /*
╭──────────╮
│         │
├──────────┤
╰──────────╯
    */
    let minimize = " ";
    let maximize = " ";
    let close = " ";
    if (false) {
        minimize = "-";
        maximize = "\u25A1";
        close = "x";
    }

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
                bBuffer += "│" + content + "│";
            } else {
                bBuffer += "│" + " ".repeat(width - 2) + "│";
            }
        }

        if (addNl)
            bBuffer += "\n";

        rBuffer += " ".repeat(x) + bBuffer;
    }

    process.stdout.write(rBuffer);
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

async function waitVisual(speed = 100, length = 2000, { text, cursor, readkey, consolekeys }) {
    let loading = true;

    let animIndex = 0;
    //let animFrames = ['|', '/', '-', '\\'];
    // alt does not uses slashes, instead it uses fancy unicode characters
    // braille anim frames
    let animFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

    let counter;

    let f = (key) => {
        if (key === consolekeys.sigint) {
            loading = false;
            clearTimeout(counter);
        } else {
            readkey().then(f);
        }
    }

    readkey().then(f);

    counter = setTimeout(() => {
        loading = false;
    }, length);

    let vw = process.stdout.columns;
    let vh = process.stdout.rows;

    text = text || "Loading";

    while (loading) {
        cursor.home();
        cursor.hide();
        let anim = animFrames[animIndex];
        let marginLeft = Math.floor((vw / 2) - ((text.realLength() + 2) / 2));
        let marginTop = Math.floor((vh / 2) + 1);
        cursor.set(marginLeft, marginTop);
        process.stdout.write(chalk.cyan(anim + " " + text));
        await new Promise(resolve => setTimeout(resolve, speed));

        if (animIndex >= animFrames.length - 1) {
            animIndex = 0;
        } else {
            animIndex++;
        }
    }
}