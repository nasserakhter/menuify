import { show } from "../context.js";
import { ffmpegWizard } from "./ffmpegWizard.js";
import { v4 } from "uuid";

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
            { name: "Open a file", value: "file" },
            new inquirer.Separator(),
            { name: "Run ffmpeg", value: "ffmpeg" },
        ]
    });

    switch (type) {
        case "ffmpeg":
            button.type = "command";
            button.action = await show(ffmpegWizard, { switchToPrimary: false });
            break;
    }

    if (props.switchToPrimary ?? true) buffer.primary();
    return button;
}