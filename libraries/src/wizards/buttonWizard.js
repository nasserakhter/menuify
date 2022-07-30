import { show } from "../context.js";
import { ffmpegWizard } from "./ffmpegWizard.js";
import { v4 } from "uuid";
import { filepickerWizard } from "./filepickerWizard.js";

export async function buttonWizard({ inquirer, props, buffer, box }) {
    let cascade = props.cascade ?? true;
    buffer.secondary();
    buffer.clear();

    box("Create button" + (cascade ? " #" + props.index : ""));
    console.log("");

    let button = {
        id: v4()
    };

    if (cascade) {
        let { name } = await inquirer.prompt({
            type: "input",
            name: "name",
            message: "Enter button text:"
        });
        button.name = name;
    }


    let { type } = await inquirer.prompt({
        type: "list",
        name: "type",
        message: "What should this button do?",
        choices: [
            { name: "Launch a program or shortcut", value: "program" },
            { name: "Execute a command", value: "command" },
            new inquirer.Separator(),
            { name: "Run ffmpeg", value: "ffmpeg" },
        ]
    });

    switch (type) {
        case "ffmpeg":
            button.type = "command";
            button.action = await show(ffmpegWizard, { switchToPrimary: false });
            break;
        case "program":
            button.type = "program";
            let { program } = await inquirer.prompt({
                type: "input",
                name: "program",
                message: "Enter the path to the program: "
            });
            button.action = {
                program,
                info: program
            };
            break;
        case "command":
            button.type = "command";
            console.log("Available variables:\n {filename} (The file's name)\n {filenameWE} (The file's name without extension)");
            let { command } = await inquirer.prompt({
                type: "input",
                name: "command",
                message: "Enter the command to execute: "
            });
            let { info } = await inquirer.prompt({
                type: "input",
                name: "info",
                message: "Give a short description or name for this command (ex. re-encode crf 30): "
            });
            button.action = {
                command,
                info
            }
            break;
    }

    process.stdin.setRawMode(true);
    if (props.switchToPrimary ?? true) buffer.primary();
    return button;
}