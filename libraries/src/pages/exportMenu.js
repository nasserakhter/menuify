import chalk from "chalk";
import { show } from "../context.js";
import filesystem from "../filesystem.js";
import { folderpickerWizard } from "../wizards/folderpickerWizard.js";

export async function exportMenu({ inquirer }) {
    let projects = await filesystem.getProjects();

    let { project } = await inquirer.prompt({
        type: "list",
        name: "project",
        message: "Select a project to export:",
        choices: projects.map(p => {
            return {
                name: `${p.name} [${p.ext}] - ${p.description}`,
                value: p
            }
        })
    });

    let cPath = await show(folderpickerWizard, { title: "Select a folder to export to" });

    let file = filesystem.exportProject(project, cPath);

    console.log(chalk.green(`Exported project to ${file}`));
}