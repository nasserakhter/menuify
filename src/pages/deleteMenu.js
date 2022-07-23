import chalk from "chalk";
import filesystem from "../filesystem.js";

export async function deleteMenu({ inquirer }) {
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

    filesystem.deleteProject(project);

    console.log(chalk.green("Project deleted successfully"));
}