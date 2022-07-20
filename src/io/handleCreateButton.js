import consolekeys from './consolekeys.js';
import box from './box.js';
import inquirer from 'inquirer';

export default async function handleCreateButton(full = true) {
    console.log(consolekeys.bufferSecondary); // switch to secondary buffer
    console.clear();
    box("Create Button");
    console.log("");
    let button = {};
    if (full) {
        let { name } = await inquirer.prompt({
            type: "input",
            name: "name",
            message: "Enter the button text:"
        });
        button.name = name;
    }
    let { targetType } = await inquirer.prompt({
        type: "list",
        name: "targetType",
        message: "What should this button do?",
        choices: [
            { name: "Launch a program or shortcut", value: "program" },
            { name: "Execute a command", value: "command" },
            { name: "Open a file", value: "file" },
            new inquirer.Separator(),
            { name: "Run ffmpeg", value: "ffmpeg" },
        ]
    });
    button.targetType = targetType;
    console.log(consolekeys.bufferPrimary); // switch to primary buffer
    return button;
}