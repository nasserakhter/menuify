import chalk from "chalk";
import filesystem from "../filesystem.js";

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

    let file = filesystem.exportProject(project);

    console.log(chalk.green(`Exported project to ${file}`));
}