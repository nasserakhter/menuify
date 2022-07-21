import { show } from "./context.js";
import { mainMenu } from "./pages/mainMenu.js";
import { createMenu } from "./pages/createMenu.js";
import filesystem from "./filesystem.js";

export async function startApp() {
    filesystem.initialize("/Users/nasserjaved/Downloads/menuify");

    let option = await show(mainMenu);
    let optionPage = null;

    switch (option) {
        case "create":
            optionPage = createMenu;
            break;
        case "edit":
            break;
        case "delete":
            break;
        case "docs":
            break;
        case "exit":
        default:
            process.exit(0);
            break;
    }

    await show(optionPage);
}