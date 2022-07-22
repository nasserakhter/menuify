import { compile } from "../../compile.js";

export async function editDescription({ inquirer, props, buffer, box }) {
    let { project } = props;
    buffer.secondary();
    buffer.clear();

    box("Edit Project Description");

    console.log("Old description: " + project.description);
    let { desc } = await inquirer.prompt({
        type: "input",
        name: "desc",
        message: "Enter a new description:"
    });
    project.description = desc;
    await compile(project);

    buffer.primary();
}