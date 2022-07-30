export async function ffmpegWizard({ inquirer, buffer, box, props }) {
    buffer.secondary();
    buffer.clear();

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
            { name: "Cut or trim the video to a specified length (mp4 -> short mp4)", value: "cut" },
        ]
    });

    let command = "";

    switch (purpose) {
        case "shrink":
            command = await setupShrink({ inquirer });
            break;
        case "cut":
            command = await setupCut({ inquirer });
            break;
        case "vid2vid":
            command = await vid2vid({ inquirer });
            break;
    }

    if (props.switchToPrimary ?? true) buffer.primary();
    return command;
}

async function vid2vid({ inquirer }) {
    let { format } = await inquirer.prompt({
        type: "list",
        name: "format",
        message: "What format would you like to convert to?",
        choices: [
            { name: "mp4", value: "mp4" },
            { name: "avi", value: "avi" },
            { name: "mov", value: "mov" },
            { name: "webm", value: "webm" },
            { name: "mkv", value: "mkv" },
            { name: "gif", value: "gif" },
            { name: "flv", value: "flv" },
            new inquirer.Separator(),
            { name: "custom", value: "custom" }
        ]
    });
    if (format === "custom") {
        let {customFormat} = await inquirer.prompt({
            type: "input",
            name: "customFormat",
            message: "What is the custom format you want to convert to?"
        });
        format = customFormat.replaceAll(/[\.\s]/g, "");
    }
    let command = `ffmpeg -i {filename}`;
    if (format === "webm") {
        command += " -c:v libvpx -c:a libvorbis";
    }
    command += ` "{filenameWE}.${format}"`;

    let { showOutput } = await inquirer.prompt({
        type: "confirm",
        name: "showOutput",
        message: "Would you like to see the output of this command?",
        default: false,
    });
    console.log(command);
    let { edit } = await inquirer.prompt({
        type: "confirm",
        name: "edit",
        message: "Would you like to edit this command?",
    });
    if (edit) {
        let { newCommand } = await inquirer.prompt({
            type: "input",
            name: "newCommand",
            message: "Please enter the new command:",
            default: command,
        });
        command = newCommand;
    }
    if (!showOutput) {
        command += " -loglevel quiet";
    }
    return {
        command,
        info: "convert to " + format
    }
}

async function setupCut({ inquirer }) {
    let { length } = await inquirer.prompt({
        type: "list",
        name: "length",
        message: "Choose time value",
        choices: [
            { name: "3 seconds", value: 3 },
            { name: "5 seconds", value: 5 },
            { name: "10 seconds", value: 10 },
            { name: "15 seconds", value: 15 },
            { name: "20 seconds", value: 20 },
            { name: "30 seconds", value: 30 },
            new inquirer.Separator(),
            { name: "Custom", value: "custom" }
        ]
    });
    if (length === "custom") {
        let { customLength } = await inquirer.prompt({
            type: "input",
            name: "customLength",
            message: "Enter the time amount:"
        });
        length = customLength;
    }
    length = parseInt(length);

    let { cutOrKeep } = await inquirer.prompt({
        type: "list",
        name: "cutOrKeep",
        message: `Do you want to cut or keep ${length} seconds of the video?`,
        choices: [
            { name: "Cut", value: "cut" },
            { name: "Keep", value: "keep" }
        ]
    });

    let positionChoices = [
        { name: "Start", value: "start" }
    ];
    if (cutOrKeep === "keep") {
        positionChoices.push({ name: "End", value: "end" });
    }

    let { position } = await inquirer.prompt({
        type: "list",
        name: "position",
        message: "Where do you want to cut the video?",
        choices: positionChoices
    });

    let command = "";
    if (position === "start" && cutOrKeep === "cut") {
        command = `-ss ${length}`;
    } else if (position === "start" && cutOrKeep === "keep") {
        command = `-ss 0 -t ${length}`;
    } else if (position === "end" && cutOrKeep === "keep") {
        command = `-sseof -${length}`;
    }
    command = `ffmpeg ${command} -i {filename} "{filenameWE}_cut.mp4"`;

    let { showOutput } = await inquirer.prompt({
        type: "confirm",
        name: "showOutput",
        message: "Lastly, would you like to see the output of the ffmpeg commands in the terminal?",
        default: false
    });

    let { edit } = await inquirer.prompt({
        type: "confirm",
        name: "edit",
        default: false,
        message: "Do you want to edit this command?"
    });
    if (edit) {
        let { edited } = await inquirer.prompt({
            type: "input",
            name: "edited",
            message: "Enter custom command (you can copy paste from above):"
        });
        command = edited;
    }

    if (!showOutput) {
        command += " -loglevel quiet";
    }
    return {
        command,
        info: `${cutOrKeep} ${length} seconds from ${position} of the video`
    };
}

async function setupShrink({ inquirer }) {
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

    let { showOutput } = await inquirer.prompt({
        type: "confirm",
        name: "showOutput",
        message: "Lastly, would you like to see the output of the ffmpeg commands in the terminal?",
        default: false
    });

    let command = 'ffmpeg -i {filename}';
    let first = true;
    let info = "ffmpeg shrink";
    if (crf !== "none") {
        command += ` -crf ${crf}`;
        if (first) {
            info += ` -`;
            first = false;
        }
        info += ` crf-${crf}`;
    }
    if (fps !== "none") {
        command += ` -vf "fps=${fps}"`;
        if (first) {
            info += ` -`;
            first = false;
        }
        info += ` ${fps}fps`;
    }
    if (res !== "none") {
        command += ` -s ${res}`;
        if (first) {
            info += ` -`;
            first = false;
        }
        info += ` ${res}`;
    }
    command += ` "{filenameWE}_shrunk.mp4"`;

    console.clear();
    console.log("This is the final ffmpeg command:");
    console.log(command);
    let { edit } = await inquirer.prompt({
        type: "confirm",
        name: "edit",
        default: false,
        message: "Do you want to edit this command?"
    });
    if (edit) {
        let { edited } = await inquirer.prompt({
            type: "input",
            name: "edited",
            message: "Enter custom command (you can copy paste from above):"
        });
        command = edited;
    }

    if (!showOutput) {
        command += " -loglevel quiet";
    }
    return {
        command,
        info
    };
}