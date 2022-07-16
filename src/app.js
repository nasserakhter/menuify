import inquirer from "inquirer";
import { handleMainMenu } from "./io/handleCommand.js";

export async function startApp() {
    let res = await inquirer.prompt({
        type: "list",
        name: "menu",
        message: "Welcome to Menuify",
        choices: [
            { name: "Create a new menu", value: "create" },
            { name: "Edit an existing menu", value: "edit" },
            { name: "Delete an existing menu", value: "delete" },
            new inquirer.Separator(),
            { name: "Exit", value: "exit" }
        ]
    });

    await handleMainMenu(res.menu);
}