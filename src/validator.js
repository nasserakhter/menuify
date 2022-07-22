export async function validateProject(project) {
    let valid = false;
    if (
        project &&
        project.name &&
        project.name.length > 0 &&
        project.ext &&
        project.ext.length > 0 &&
        project.description &&
        project.description.length > 0 &&
        project.buttons &&
        project.buttons.length > 0
    ) {
        valid = true;
    }
    return valid;
}