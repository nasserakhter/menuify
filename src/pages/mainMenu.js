export async function mainMenu({ inquirer }) {
    let { menu } = await inquirer.prompt({
        type: "list",
        name: "menu",
        message: "Welcome to Menuify",
        choices: [
            { name: "Create a new menu", value: "create" },
            { name: "Edit an existing menu", value: "edit" },
            { name: "Delete an existing menu", value: "delete" },
            new inquirer.Separator(),
            { name: "Read the documentation", value: "docs" },
            { name: "Exit", value: "exit" }
        ]
    });
    return menu;
}