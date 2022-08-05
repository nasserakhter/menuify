import { compile } from "../compile.js";
import { show } from "../context.js";
import { logVerbose } from "../logger.js";
import { buttonWizard } from "../wizards/buttonWizard.js";
import { cascadeMenuWizard } from "../wizards/cascadeMenuWizard.js";
import { filepickerWizard } from "../wizards/filepickerWizard.js";
import { convertToIcon } from '../interface/imagingInterface.js';

export async function createMenu({ inquirer, v4 }) {
    // Create a new project
    logVerbose("[Navigator] Showing 'createMenu'");
    let project = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter a display name (this will appear in the right click menu):"
        },
        {
            type: "input",
            name: "description",
            message: "Enter a description:"
        },
        {
            type: "input",
            name: "ext",
            message: "Enter the file extension this menu will appear on (ex: mp4, mp3, png, etc.):"
        },
        {
            type: "confirm",
            name: "cascade",
            message: "Is this a cascading menu (will this be a submenu with multiple buttons [y] or just one single button [n])?:",
            default: false
        },
        {
            type: "confirm",
            name: "icon",
            message: "Do you want to add an icon image to this menu?:"
        }
    ]);
    process.stdin.setRawMode(true);
    project.ext = project.ext.replace(/\./g, "");
    if (project.icon) {
        let chosenFile = await show(filepickerWizard, { title: "Select an icon", filters: ["png", "jpg", "jpeg", "jfif", "bmp", "tiff"] });
        console.log("Converting to icon..");
        let imgBuffer = await convertToIcon(chosenFile, 32, 32);
        project.rawIcon = imgBuffer.toString("base64");
    }
    project.id = v4();
    project.buttons = [];
    process.stdin.setRawMode(true);
    if (project.cascade) {
        project.buttons = await show(cascadeMenuWizard);
    } else {
        let button = await show(buttonWizard, { index: 0, cascade: false });
        project.buttons.push(button);
    }
    compile(project);
}