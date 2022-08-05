import { show } from "../context.js";
import { filepickerWizard } from "../wizards/filepickerWizard.js";
import fs from 'fs';
import { validateProject } from "../validator.js";
import { compile } from "../compile.js";
import MenuifyError from "../menuifyError.js";
import chalk from "chalk";

export async function importMenu({ inquirer, buffer }) {
    let path = await show(filepickerWizard, { filters: ["menu"] });
    if (path) {
        console.log("Reading menu...");
        let project = JSON.parse(fs.readFileSync(path));
        if (validateProject(project)) {
            buffer.secondary();
            buffer.clear();

            String.prototype.realLength = function () {
                return this.replace(/\x1B\[[0-9;]*?m(?:DA)*/g, "").length;
            }

            let menu = project;
            let width = Math.min(process.stdout.columns, 80);
            let i = 0;
            let highlight = 1;

            let tBuffer = [];
            let name = s(menu.name, 20) + " | " + menu.ext + " " + chalk.gray(menu.id);
            let desc = menu.description;
            let btns = "Contains " + menu.buttons.length + " button" + (menu.buttons.length === 1 ? "" : "s");
            let max = Math.max(name.realLength(), desc.realLength(), btns.realLength());
            let padding = 1;

            let spacer = " ".repeat(padding + max + padding);
            let ogSpacer = spacer;

            name = name + " ".repeat(Math.max(0, max - name.realLength()));
            desc = desc + " ".repeat(Math.max(0, max - desc.realLength()));
            btns = btns + " ".repeat(Math.max(0, max - btns.realLength()));

            name = " ".repeat(padding) + name + " ".repeat(padding);
            desc = " ".repeat(padding) + desc + " ".repeat(padding);
            btns = " ".repeat(padding) + btns + " ".repeat(padding);

            if (i === highlight) {
                name = chalk.bgWhite.black(name);
                desc = chalk.bgWhite.black(desc);
                btns = chalk.bgWhite.black(btns);
                spacer = chalk.bgWhite.black(spacer);
            }

            tBuffer.push(" ".repeat(padding) + "-".repeat(max) + " ".repeat(padding));
            tBuffer.push(s(spacer, width));
            tBuffer.push(s(name, width));
            tBuffer.push(s(desc, width));
            tBuffer.push(s(btns, width));
            tBuffer.push(s(spacer, width));
            tBuffer.push(" ".repeat(padding) + "-".repeat(max) + " ".repeat(padding));

            console.log(tBuffer.join("\n"));

            let answer = await inquirer.prompt({
                type: "confirm",
                name: "install",
                message: "Do you really want to install this menu?",
                default: false
            });

            buffer.primary();

            if (answer.install) {
                await compile(project);
                console.log(chalk.green("Done"));
            } else {
                console.log(chalk.yellow("Aborted"));
            }
        } else {
            throw new MenuifyError("Invalid menu file");
        }
    } else {
        console.log(chalk.red("No file chosen"));
    }
}

function s(str, wid) {
    let length = str.realLength();
    return str + " ".repeat(Math.max(0, wid - length));
}