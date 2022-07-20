import inquirer from "inquirer";
import box from "../box.js";
import consolekeys from "../consolekeys.js";

export default async function handleFfmpeg() {
    console.log(consolekeys.bufferSecondary); // switch to secondary buffer
    console.clear();
    box("Setup ffmpeg command");
    console.log("");
    console.log("This wizard will guide you through setting up an ffmpeg command");
    let { purpose } = await inquirer.prompt({
        type: "list",
        name: "purpose",
        message: "What is the purpose of this command?",
        choices: [
            { name: "Convert a video to another video format (mp4 -> mov, avi, gif, etc.)", value: "vid2vid" },
            { name: "Convert a video to an audio format (mp4 -> mp3, wav, m4v, etc.)", value: "vid2aud" },
            { name: "Shrink and compress a video format (mp4 -> smaller mp4)", value: "shrink" },
            new inquirer.Separator(),
            { name: "Custom", value: "custom" }
        ]
    });
    let command = "";
    switch (purpose) {
        case "shrink":
            command = await setupShrink();
            break;
    }
    console.log(consolekeys.bufferPrimary); // switch to primary buffer
    return command;
}

async function setupShrink() {
    console.clear();
    let { crf } = await inquirer.prompt({
        type: "list",
        name: "crf",
        message: "What is the quality of the output video?",
        choices: [
            { name: "Dont alter quality", value: "none" },
            new inquirer.Separator(),
            { name: "Low (crf: 50)", value: "50" },
            { name: "Medium (crf: 35)", value: "35" },
            { name: "Good (crf: 25)", value: "25" },
            { name: "Very good (crf: 20)", value: "20" },
            { name: "Custom", value: "custom" }
        ]
    });
    if (crf === "custom") {
        let { customCrf } = await inquirer.prompt({
            type: "input",
            name: "customCrf",
            message: "Enter a custom crf value:"
        });
        crf = customCrf;
    }

    let { fps } = await inquirer.prompt({
        type: "list",
        name: "fps",
        message: "What is the desired output framerate?",
        choices: [
            { name: "Dont alter framerate", value: "none" },
            new inquirer.Separator(),
            { name: "25 fps", value: "25" },
            { name: "30 fps", value: "30" },
            { name: "50 fps", value: "50" },
            { name: "60 fps", value: "60" },
            { name: "Custom", value: "custom" }
        ]
    });
    if (fps === "custom") {
        let { customFps } = await inquirer.prompt({
            type: "input",
            name: "customFps",
            message: "Enter a custom framerate:"
        });
        fps = customFps;
    }

    let { res } = await inquirer.prompt({
        type: "list",
        name: "res",
        message: "What is the desired output resolution?",
        choices: [
            { name: "Dont alter resolution", value: "none" },
            new inquirer.Separator(),
            { name: "640x360", value: "640x360" },
            { name: "1280x720", value: "1280x720" },
            { name: "1920x1080", value: "1920x1080" },
            { name: "Custom", value: "custom" }
        ]
    });
    if (res === "custom") {
        let { customRes } = await inquirer.prompt({
            type: "input",
            name: "customRes",
            message: "Enter a custom resolution:"
        });
        res = customRes;
    }

    let command = 'ffmpeg -i {filename}';
    if (crf !== "none") {
        command += ` -crf ${crf}`;
    }
    if (fps !== "none") {
        command += ` -vf "fps=${fps}"`;
    }
    if (res !== "none") {
        command += ` -s ${res}`;
    }
    command += ` {output}`;

    console.clear();
    console.log("This is the final ffmpeg command:");
    console.log(command);
    let {edit} = await inquirer.prompt({
        type: "confirm",
        name: "edit",
        message: "Do you want to edit this command?"
    });
    if (edit) {
        let {edited} = await inquirer.prompt({
            type: "input",
            name: "edited",
            message: "Enter custom command (you can copy paste from above):"
        });
        command = edited;
    }
    return command;
}