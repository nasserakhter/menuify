import _reg from "regedit";
const regedit = _reg.promisified;

export async function bindButton(project, button, location) {
    // windows registry stuff
    /*
    let regedit = {};
    regedit.putValue({
        [`HKCR\\SystemFileAssociations\\${project.ext}\\shell\\command`]: {
            value: location
        }
    })*/
    let rootNode = "HKCR\\SystemFileAssociations\\" + project.ext + "\\shell\\" + project.id;
    let commandNode = rootNode + "\\command";
    try {
        await regedit.createKey([
            commandNode
        ]);
    } catch (err) { }
    let query = {
        [rootNode]: {
            "MUIVerb": {
                value: project.name,
                type: "REG_SZ"
            }
        },
        [commandNode]: {
            "menuifyCommandLocation": {
                value: button.location,
                type: "REG_DEFULT"
            }
        }
    };
    if (project.icon) query[rootNode]['Icon'] = {
        value: `"project.icon"`,
        type: "REG_SZ"
    };
    let result = await regedit.putValue(query);
}

export async function bindButtons(project, button) {
    // windows registry stuff
    /*
    let regedit = {};
    regedit.putValue({
        [`HKCR\\SystemFileAssociations\\${project.ext}\\shell\\command`]: {
            value: location
        }
    })*/
}

export async function unbindProject(project) {

}