import { compile } from "../../compile.js";

export async function editName({ inquirer, props, buffer, box }) {
    let { project } = props;
    buffer.secondary();
    buffer.clear();

    box("Edit Project Name");

    console.log("Old name: " + project.name);
    let { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "Enter a new name:"
    });
    project.name = name;
    await compile(project);

    buffer.primary();
}