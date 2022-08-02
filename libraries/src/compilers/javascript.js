export function compileJavascript(action) {

    let command = action.command.replaceAll("{filename}", "${filename}").replaceAll("{filenameWE}", "${filenameWE}");

    return `
    (async () => {
        const c = (...a) => process.stdout.write(...a);
        c("\\x1b]0m;Menuify - Javascript Command\\x07");
        console.clear();
        c("\\x1b[8;7;80t");
        if (process.argv.length >= 3) {
            const path = require("path");
            const { execSync } = require("child_process");
            let filename = process.argv[2];
            let filenameWE = path.parse(filename).name;
        
            c("\\x1b[30;43m Running command 'ffmpeg shrink - crf-50 25fps 640x360' \\x1b[0m\\n");
        
            execSync(\`${command}\`, {stdio: "inherit"});
        } else {
            c("\\x07");
            c("\\x1b[29;41m Error: This script requires a file parameter \\x1b[0m\\n");
            process.stdin.setRawMode(true);
            process.stdin.resume();
            await new Promise((r) => {
                process.stdin.once('data', () => {
                    process.stdin.pause();
                    r();
                });
            });
        }
    })();`;
}