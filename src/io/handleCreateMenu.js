import inquirer from "inquirer";
import handleCreateCascadeMenu from "./handleCreateCascadeMenu.js";
import handleCreateButton from "./handleCreateButton.js";

export default async function handleCreateMenu() {
    // required params
    let name = ""; // display name
    let description = ""; // description
    let ext = ""; // the file extension this menu will cover
    let cascade = false; // whether this is a single button or cascading menu
    let icon = ""; // the icon to display for this menu
    let buttons = []; // the buttons in this menu, if cascading

    let params = await inquirer.prompt([
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

    if (params.cascade) {
        params.buttons = await handleCreateCascadeMenu();
    } else {
        params.button = await handleCreateButton(false);
    }

    console.dir(params);
}