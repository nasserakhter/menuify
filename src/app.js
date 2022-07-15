import inquirer from "inquirer";

export async function startApp() {
    let menu = await inquirer.prompt({
        type: "list",
        name: "menu",
        message: "Welcome to Menuify",
        choices: [
            "Create a new menu",
            "Edit an existing menu",
            "Delete an existing menu",
            "Exit"
        ]
    });
    console.log(menu);
}