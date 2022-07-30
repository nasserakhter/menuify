import _reg from "regedit";
const regedit = _reg.promisified;
import { registry } from './native/index.js';
import { constants } from './constants.js';

export async function bindButton(project, button, location) {
    // windows registry stuff
    /*
    let regedit = {};
    regedit.putValue({
        [`HKCR\\SystemFileAssociations\\${project.ext}\\shell\\command`]: {
            value: location
        }
    })*/
    /*
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
        value: `"${project.icon}"`,
        type: "REG_SZ"
    };
    let result = await regedit.putValue(query);
    */
    let fileAssoc = constants.regkey;
    let ext = project.ext;
    if (project.ext !== "*") {
        ext = "." + project.ext;
    }
    let fileAssocExt = `${fileAssoc}/${ext}`;
    let rawRoot = `${fileAssocExt}/shell`;

    let extRoot;
    try {
        extRoot = registry(rawRoot);
    } catch (err) {
        // root does not contain shell key
        let eroot;
        try {
            // root does not even exist
            eroot = registry(fileAssocExt);
        } catch (e) {
            registry(fileAssoc).add(ext);
            eroot = registry(fileAssocExt);
        }
        eroot.add('shell');
        extRoot = registry(rawRoot);
    }
    extRoot.add(project.id);

    let root = registry(`${rawRoot}/${project.id}`);

    // Add root values
    root.add('MUIVerb', project.name);
    if (project.icon) root.add('Icon', project.icon);

    root.add('command');

    let command = registry(`${rawRoot}/${project.id}/command`);

    command.add('(Default)', `"${location}" %*%`);
    return true;
}

export async function bindButtons(project, buttons) {
    let ext = project.ext;
    if (project.ext !== "*") {
        ext = "." + project.ext;
    }
    let rawRoot = `${constants.regkey}/${ext}/shell`;
    let extRoot;
    try {
        extRoot = registry(rawRoot);
    } catch (err) {
        // root does not contain shell key
        let eroot;
        try {
            // root does not even exist
            eroot = registry(fileAssocExt);
        } catch (e) {
            registry(fileAssoc).add(ext);
            eroot = registry(fileAssocExt);
        }
        eroot.add('shell');
        extRoot = registry(rawRoot);
    }
    extRoot.add(project.id);

    let root = registry(`${rawRoot}/${project.id}`);
    // Values
    root.add('MUIVerb', project.name);
    root.add('subcommands', ' ');
    if (project.icon) root.add('Icon', project.icon);
    // Key
    root.add('shell');

    let shell = registry(`${rawRoot}/${project.id}/shell`);

    buttons.forEach(button => {
        shell.add(button.id);
        let btnKey = registry(`${rawRoot}/${project.id}/shell/${button.id}`);
        btnKey.add('MUIVerb', button.name);
        btnKey.add('command');
        let command = registry(`${rawRoot}/${project.id}/shell/${button.id}/command`);
        command.add('(Default)', `"${button.location}" "%1%"`);
    });
}

export async function unbindProject(project) {
    try {
        let ext = project.ext;
        if (project.ext !== "*") {
            ext = "." + project.ext;
        }
        let root = registry(`${constants.regkey}/${ext}/shell/${project.id}`);
        root.remove();
    } catch (err) { }
}