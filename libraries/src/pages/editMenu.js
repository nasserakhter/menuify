import chalk from "chalk";
import { unbindProject } from "../binder.js";
import filesystem from "../filesystem.js";
import { editName } from "./editMenu/editName.js";
import { show } from "../context.js";
import { editDescription } from "./editMenu/editDescription.js";
import { editExtension } from "./editMenu/editExtension.js";

export async function editMenu({ inquirer }) {
    let projects = filesystem.getProjects();
    let { project } = await inquirer.prompt({
        type: "list",
        name: "project",
        message: "Select a project to edit:",
        choices: projects.map(p => {
            return {
                name: `${p.name} [${p.ext === "[dir]" ? chalk.magenta("directory") : p.ext}] - ${p.description}`,
                value: p
            }
        })
    });

    let { option } = await inquirer.prompt({
        type: "list",
        name: "option",
        message: "What do you want to edit in this project?",
        choices: [
            { name: "Name: " + project.name, value: "name" },
            { name: "Description: " + project.description, value: "description" },
            { name: "Extension: ." + project.ext, value: "ext" },
            { name: "Icon: " + project.icon, value: "icon" },
            { name: "Buttons: " + project.buttons.length, value: "buttons" },
            new inquirer.Separator(),
            { name: chalk.red("Delete Project"), value: "delete" }
        ]
    });

    let editPage = null;

    switch (option) {
        case "name":
            editPage = editName;
            break;
        case "description":
            editPage = editDescription;
            break;
        case "ext":
            editPage = editExtension;
            break;

        case "delete":
            let { confirm } = await inquirer.prompt({
                type: "confirm",
                name: "confirm",
                message: `Are you sure you want to delete ${project.name}?`
            });
            if (confirm) {
                filesystem.deleteProject(project);
                await unbindProject(project);
                console.log(chalk.green("Project deleted."));
            } else {
                console.log(chalk.yellow("No changes made."));
            }
            return;
    }

    await show(editPage, { project });
    console.log(chalk.green("Project saved."));
}