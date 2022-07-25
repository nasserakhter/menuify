import chalk from "chalk";
import { show } from "../context.js";
import FfmpegInterface from "../interface/ffmpegInterface.js";

export async function moreMenu({ inquirer }) {
    FfmpegInterface.installFfmpeg();
    return;
    let { option } = await inquirer.prompt({
        type: "list",
        name: "option",
        message: "Select a menu option:",
        choices: [
            { name: "Download or update ffmpeg", value: "ffmpeg" },
            { name: "Developer options", value: "developer" },
            { name: "Read the terms and conditions", value: "terms" },
        ]
    });

    switch (option) {
        case "ffmpeg":
            await show(ffmpegMenu);
            break;
    }
}

async function ffmpegMenu({ inquirer }) {
    let isFfmpegInstalled = FfmpegInterface.isFfmpegInstalled();
    if (isFfmpegInstalled) {
    } else {
        console.log(chalk.red("FFmpeg is not currently installed."));
        let {install} = await inquirer.prompt({
            type: "confirm",
            name: "install",
            message: "Would you like to install FFmpeg?"
        });

        if (install) {
            FfmpegInterface.installFfmpeg();
        }
    }
}