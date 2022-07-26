import chalk from "chalk";

export async function storePage({ buffer, alert, cursor, readkey, consolekeys }) {
    //await alert("Disclaimer", "Current menu's do not support downloading dependencies, if a menu requires a certain program to be installed, you must install it yourself. Note: This store is currently in beta, you may experience bugs and or other flaws.", ["Okay"]);

    buffer.secondary();
    buffer.clear();

    await waitVisual(100, 2000, {
        cursor, readkey, consolekeys
    });
    buffer.clear();
    await readkey();

    buffer.primary();
    cursor.show();
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