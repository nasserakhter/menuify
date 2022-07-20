import inquirer from "inquirer";
import box from "./box.js";
import consolekeys from "./consolekeys.js";

export default async function docsMenu() {
    console.log(consolekeys.bufferSecondary); // switch to secondary buffer
    console.clear();
    box("Documentation");
    let { cat } = await inquirer.prompt({
        type: "list",
        name: "cat",
        message: "What would you like to read?",
        choices: [
            { name: "Creating a button", value: "button" },
            { name: "Creating a menu", value: "menu" },
            { name: "Working with the ffmpeg wizard", value: "ffmpeg" },
        ]
    });
    switch (cat) {
        case "ffmpeg":
            console.log("* Writing FFmpeg commands");
            console.log("When writing an ffmpeg command, you can use the following variables:");
            console.log(" - filename: The input file name (ex: video.mp4)");
            console.log(" - filenameWE: The input file without extension (ex: video)");
            break;
    }
    await inquirer.prompt({
        type: "confirm",
        name: "continue",
        message: "Press any key or enter to exit."
    });
    console.log(consolekeys.bufferPrimary); // switch to primary buffer
    return;
}