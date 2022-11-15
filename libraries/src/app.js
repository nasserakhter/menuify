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
import FfmpegInterface from "./interface/ffmpegInterface.js";
import chalk from "chalk";
import Grid from "./gui/grid2.js";
import Blank from "./gui/blank.js";
import { execSync } from "./native/lib/Command.js";

export async function startApp() {
    process.stdin.setRawMode(true);
    let basePath = "";
    if (process.platform === "win32") {
        let appdata = execSync("echo %APPDATA%").toString().trim();
        basePath = path.join(appdata, "microart", "menuify");
    } else {
        basePath = path.join(getDownloadsFolder(), "menuify");
    }
    filesystem.initialize(basePath);
    await FfmpegInterface.initialize();

    if (!FfmpegInterface.isFfmpegInstalled()) {
        console.log(chalk.yellow("Ffmpeg is not installed, you can install in 'more options'"));
    }

    
    /*await show(async ({ buffer, readkey, consolekeys }) => {
        buffer.secondary();
        buffer.clear();
        let grid = new Grid();
        grid.uniformBorder(grid.borders.ROUNDED);
        grid.columns = 2;
        grid.rows = 1;

        let blank1 = new Grid();
        let blank2 = new Blank();
        blank1.uniformBorder(blank1.borders.ROUNDED);
        grid.children.push(blank1);
        grid.children.push(blank2);
        //grid.setViewport(process.stdout.columns, 10);
        grid.useConsoleViewport();
        grid.uniformBorder(grid.borders.ROUNDED);
        //grid.paddingRight(1);
        //grid.uniformPadding(1);

        let sizeMargins = () => {
            let { width, height } = grid.getViewport(false);
            grid.marginLeft(width < 120 ? 0 : "10%");
            grid.marginRight(width < 120 ? 0 : "10%");

            grid.marginTop(height < 40 ? 0 : "10%");
            grid.marginBottom(height < 40 ? 0 : "10%");
        }

        sizeMargins();

        grid.onResize = () => {
            grid.useConsoleViewport();
            sizeMargins();
        }

        await grid.streamConsoleViewportAsync();

        buffer.primary();
    });
    return;*/
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