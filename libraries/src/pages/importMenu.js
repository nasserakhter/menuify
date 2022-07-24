import { show } from "../context.js";
import { filepickerWizard } from "../wizards/filepickerWizard.js";
import fs from 'fs';
import { validateProject } from "../validator.js";
import { compile } from "../compile.js";
import MenuifyError from "../menuifyError.js";
import chalk from "chalk";

export async function importMenu({ inquirer }) {
    let path = await show(filepickerWizard, { filters: ["menu"] });
    if (path) {
        console.log("Reading menu...");
        let project = JSON.parse(fs.readFileSync(path));
        if (validateProject(project)) {
            await compile(project);
            console.log(chalk.green("Done"));
        } else {
            throw new MenuifyError("Invalid menu file");
        }
    } else {
        console.log(chalk.red("No file chosen"));
    }
}