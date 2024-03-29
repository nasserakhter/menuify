import { logVerbose } from "../logger.js";

export async function mainMenu({ inquirer }) {
    logVerbose("[Navigator] Showing 'mainMenu'");
    let { menu } = await inquirer.prompt({
        type: "list",
        name: "menu",
        message: "Welcome to Menuify",
        choices: [
            { name: "Create a new menu", value: "create" },
            { name: "Edit an existing menu", value: "edit" },
            { name: "Delete an existing menu", value: "delete" },
            new inquirer.Separator(),
            { name: "Import a menu", value: "import" },
            { name: "Export a menu", value: "export" },
            { name: "Menuify Store", value: "store" },
            new inquirer.Separator(),
            { name: "Read the documentation", value: "docs" },
            { name: "More options", value: "more" },
            { name: "Exit", value: "exit" },
            new inquirer.Separator()
        ]
    });
    return menu;
}