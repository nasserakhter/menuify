import { show } from "./context.js";
import { mainMenu } from "./pages/mainMenu.js";
import { createMenu } from "./pages/createMenu.js";
import filesystem from "./filesystem.js";
import { editMenu } from "./pages/editMenu.js";
import { importMenu } from "./pages/importMenu.js";
import { exportMenu } from "./pages/exportMenu.js";
import { storePage } from "./pages/storePage.js";

export async function startApp() {
    filesystem.initialize("/Users/nasserjaved/Downloads/menuify");

    let option = await show(mainMenu);
    let optionPage = null;

    switch (option) {
        case "create":
            optionPage = createMenu;
            break;
        case "edit":
            optionPage = editMenu;
            break;
        case "delete":
            break;
        // Seperator
        case "import":
            optionPage = importMenu;
            break;
        case "export":
            optionPage = exportMenu;
            break;
        case "store":
            optionPage = storePage;
            break;
        // Seperator
        case "docs":
            break;
        case "exit":
        default:
            process.exit(0);
            break;
    }

    await show(optionPage);
}