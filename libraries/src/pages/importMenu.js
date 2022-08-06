import { show } from "../context.js";
import { filepickerWizard } from "../wizards/filepickerWizard.js";
import fs from 'fs';
import { validateProject } from "../validator.js";
import { compile } from "../compile.js";
import MenuifyError from "../menuifyError.js";
import chalk from "chalk";
import terminalImage from 'terminal-image';
import saffron from "../gui/saffron.js";
import { useRealLength } from "../gui/saffronUtils.js";

export async function importMenu({ inquirer, readkey, consolekeys }) {
    let path = await show(filepickerWizard, { filters: ["menu"] });
    if (path) {
        console.log("Reading menu...");
        let project = JSON.parse(fs.readFileSync(path));

        if (true && validateProject(project)) {

            let keys = ["name", "description", "ext", "cascade"];
            let width = 0;
            let nameWidth = Math.max(...keys.map(key => key.length));

            keys.forEach(key => {
                console.log(`${key.padEnd(nameWidth)} : ${project[key]}`);
            });

            let cert = project.certificate;

            useRealLength();
            let boxWidth = 40;
            let title = "Certificate Information";
            let pad = boxWidth - title.length;
            console.log("╭" + "─".repeat(boxWidth) + "╮");
            console.log("│" + " ".repeat(Math.ceil(pad / 2)) + title + " ".repeat(Math.floor(pad / 2)) + "│");
            console.log("├" + "─".repeat(boxWidth) + "┤");
            if (cert) {
                console.log("│" + cert.issuer.padEnd(boxWidth) + "│");
                console.log("│" + `${cert.validity.notBefore} - ${cert.validity.notAfter}`.padEnd(boxWidth) + "│");
                let auth = "This certificate is authentic";
                console.log("│" + chalk.green(auth) + " ".repeat(Math.max(boxWidth - auth.realLength(), 0)) + "│");
            } else {
                let text = "This menu is not signed.";
                let textPad = boxWidth - text.length;
                console.log("│" + " ".repeat(boxWidth) + "│");
                console.log("│" + " ".repeat(Math.ceil(textPad / 2)) + text + " ".repeat(Math.floor(textPad / 2)) + "│");
                console.log("│" + " ".repeat(boxWidth) + "│");
            }
            console.log("╰" + "─".repeat(boxWidth) + "╯");
            console.log("");
            console.log("> This project contains " + project.buttons.length + " button" + (project.buttons.length > 1 ? "s" : "") + ".");
            console.log("\n")
            useRealLength(false);

            process.stdout.write("Press [v] to inspect the buttons, [i] to install, or any other key to cancel: ");
            let loop = true;
            while (loop) {
                let key = await readkey();
                switch (key) {
                    case "v":
                        break;
                    case "i":
                        await compile(project);
                        break;
                    default:
                    case consolekeys.sigint:
                        loop = false;
                        break;
                }
            }
        } else {
            throw new MenuifyError("Invalid menu file");
        }
    } else {
        console.log(chalk.red("No file chosen"));
    }
}