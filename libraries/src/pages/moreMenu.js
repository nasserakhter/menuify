import chalk from "chalk";
import { show } from "../context.js";
import FfmpegInterface from "../interface/ffmpegInterface.js";

export async function moreMenu({ inquirer }) {
    let isFfmpegInstalled = FfmpegInterface.isFfmpegInstalled();
    let choices = [];

    if (isFfmpegInstalled === 0) {
        choices.push({ name: "Download ffmpeg", value: "ffmpeg" });
    } else if (isFfmpegInstalled === 1) {
        choices.push({ name: "Update ffmpeg", value: "ffmpeg" });
    } else {
        console.log(chalk.yellow("Menuify is using a copy of Ffmpeg found already installed, it cannot be updated by menuify."));
    }

    choices = [
        ...choices,
        { name: "Developer options", value: "developer" },
        { name: "Read the terms and conditions", value: "terms" },
    ]
    let { option } = await inquirer.prompt({
        type: "list",
        name: "option",
        message: "Select a menu option:",
        choices
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
        console.log(chalk.green("FFmpeg is installed."));
        let { install } = await inquirer.prompt({
            type: "confirm",
            name: "install",
            message: "Do you want to redownload (and update, if possible)?"
        });

        if (install) {
            FfmpegInterface.installFfmpeg();
        }
    } else {
        console.log(chalk.red("FFmpeg is not currently installed."));
        let { install } = await inquirer.prompt({
            type: "confirm",
            name: "install",
            message: "Would you like to install FFmpeg?"
        });

        if (install) {
            FfmpegInterface.installFfmpeg();
        }
    }
}