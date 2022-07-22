import { compile } from "../../compile.js";

export async function editExtension({ inquirer, props, buffer, box }) {
    let { project } = props;
    buffer.secondary();
    buffer.clear();

    box("Edit Project Extension");

    console.log("Old extension: " + project.ext);
    let { ext } = await inquirer.prompt({
        type: "input",
        name: "ext",
        message: "Enter a new extension:"
    });
    project.ext = ext;
    await compile(project);

    buffer.primary();
}