import { show } from "./context.js";
import { mainMenu } from "./pages/mainMenu.js";
import { createMenu } from "./pages/createMenu.js";
import filesystem from "./filesystem.js";
import { editMenu } from "./pages/editMenu.js";
import { importMenu } from "./pages/importMenu.js";
import { exportMenu } from "./pages/exportMenu.js";
import { storePage } from "./pages/storePage.js";
import { docsPage } from "./pages/docsPage.js";
import { deleteMenu } from "./pages/deleteMenu.js";
import getDownloadsFolder from 'downloads-folder';
import path from 'path';
import { moreMenu } from "./pages/moreMenu.js";

export async function startApp() {
    process.stdin.setRawMode(true);
    filesystem.initialize(path.join(getDownloadsFolder() + "/menuify"));
    await show(moreMenu);
    return;

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
            optionPage = deleteMenu;
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
            optionPage = docsPage;
            break;
        case "more":
            optionPage = moreMenu;
            break;
        case "exit":
        default:
            process.exit(0);
            break;
    }

    await show(optionPage);
}