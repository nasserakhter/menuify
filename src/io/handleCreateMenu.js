import inquirer from "inquirer";
import handleCreateCascadeMenu from "./handleCreateCascadeMenu.js";
import handleCreateButton from "./handleCreateButton.js";
/*
import compileCommand from "./compilers/commandCompiler.js";
import { init, compileFile, writeManifest } from './compilers/fileCompiler.js';
*/
import compileManifest from "./compilers/compileManifest.js";
import { v4 } from "uuid";

export default async function handleCreateMenu() {
    /*
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
    params.id = v4()

    if (params.cascade) {
        params.buttons = await handleCreateCascadeMenu();
    } else {
        params.buttons = [await handleCreateButton(false)];
    }*/

    let params = {
        name: 'shrink',
        description: 'shinrky',
        ext: 'mp4',
        cascade: false,
        icon: false,
        id: '19e8697b-683b-47fa-9250-e6d4e5c41790',
        buttons: [
            {
                type: 'command',
                id: "12e8697b-683b-47fa-9250-e6d4e5c41790",
                action: 'ffmpeg -i {filename} -crf 35 -vf "fps=30" -s 1920x1080 {filenameWE}_shrunk.mp4'
            }
        ]
    }

    compileManifest(params);
    /*
    let comComp = compileCommand(params.button.action, {
        project_id: params.id,
        button_name: params.name,
        button_targetType: params.button.type
    });
    let { confirm } = await inquirer.prompt({
        type: "confirm",
        name: "confirm",
        message: "Do you want to create this menu?"
    });

    if (confirm) {
        init();
        let file = compileFile(params.id, comComp);
        let json = JSON.stringify(params);
        let manifest = writeManifest(params.id, json);
        console.log(file);
        console.log(manifest);
    }
    */
}