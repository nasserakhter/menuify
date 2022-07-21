import { compile } from "../compile.js";
import { show } from "../context.js";
import filesystem from "../filesystem.js";
import { buttonWizard } from "../wizards/buttonWizard.js";
import { cascadeMenuWizard } from "../wizards/cascadeMenuWizard.js";

export async function createMenu({ inquirer, v4 }) {
    // Create a new project
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
    if (project.icon) {
        let { icon } = await inquirer.prompt({
            type: "input",
            name: "icon",
            message: "Drop the image file here (or enter the path):"
        });
        project.icon = icon;
    }
    project.id = v4();
    project.buttons = [];

    if (project.cascade) {
        project.buttons = await show(cascadeMenuWizard);
    } else {
        let button = await show(buttonWizard, { index: 0, cascade: false });
        project.buttons.push(button);
    }
    compile(project);
}