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
                name: `${p.name} [${p.ext === "[dir]" ? chalk.magenta("directory") : p.ext}] - ${p.description}`,
                value: p
            }
        })
    });

    let { confirm } = await inquirer.prompt({
        type: "confirm",
        name: "confirm",
        message: `Are you sure you want to delete ${project.name}?`
    });

    if (confirm) {
        filesystem.deleteProject(project);

        console.log(chalk.green("Project deleted successfully"));
    } else {
        console.log(chalk.yellow("No changes made"));
    }
}