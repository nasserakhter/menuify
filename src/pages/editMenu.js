import chalk from "chalk";
import { unbindProject } from "../binder.js";
import filesystem from "../filesystem.js";
import { editName } from "./editMenu/editName.js";
import { show } from "../context.js";

export async function editMenu({ inquirer }) {
    let projects = filesystem.getProjects();
    let { project } = await inquirer.prompt({
        type: "list",
        name: "project",
        message: "Select a project to edit:",
        choices: projects.map(p => {
            return {
                name: `${p.name} [${p.ext}] - ${p.description}`,
                value: p
            }
        })
    });

    let { option } = await inquirer.prompt({
        type: "list",
        name: "option",
        message: "What do you want to do with this project?",
        choices: [
            { name: "Edit Name", value: "name" },
            { name: "Edit Description", value: "description" },
            { name: "Edit Extension", value: "ext" },
            { name: "Edit Icon", value: "icon" },
            { name: "Edit Buttons", value: "buttons" },
            new inquirer.Separator(),
            { name: "Delete Project", value: "delete" }
        ]
    });

    let editPage = null;

    switch (option) {
        case "name":
            editPage = editName;
            break;
        case "delete":
            filesystem.deleteProject(project);
            await unbindProject(project);
            console.log(chalk.green("Project deleted."));
            return;
    }

    await show(editPage, { project });
    console.log(chalk.green("Project saved."));
}