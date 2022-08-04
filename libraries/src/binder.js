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
    if (project.ext === "[dir]") {
        return bindDirectory(project, button, location);
    } else if (project.ext !== "*") {
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

    command.add('(Default)', `${location} "%1%"`);
    return true;
}

async function bindDirectory(project, button, location) {
    let topKey = registry(constants.directoryRegkey); // "HKCR/Directory";
    let indirectTopKey = null; // "HKCR/Directory/Background";

    let directRoot = null; // "HKCR/Directory/shell";
    let indirectRoot = null; // "HKCR/Directory/Background/shell";

    // Recursive create background an shell directory if non-existent, otherwise simply return
    try {
        indirectRoot = registry(`${constants.directoryRegkey}/Background/shell`);
    } catch (e) {
        // Bcakground does not have shell key
        try {
            indirectTopKey = registry(`${constants.directoryRegkey}/Background`);
        } catch (e) {
            // Background does not even exist
            topKey.add('Background');
            indirectTopKey = registry(`${constants.directoryRegkey}/Background`);
        }
        indirectTopKey.add('shell');
        indirectRoot = registry(`${constants.directoryRegkey}/Background/shell`);
    }

    // Recursive create shell directory if non-existent, otherwise simply return
    try {
        directRoot = registry(`${constants.directoryRegkey}/shell`);
    } catch (e) {
        topKey.add('shell');
        directRoot = registry(`${constants.directoryRegkey}/shell`);
    }
    directRoot.add(project.id);
    indirectRoot.add(project.id);

    let directKey = registry(`${constants.directoryRegkey}/shell/${project.id}`);
    let indirectKey = registry(`${constants.directoryRegkey}/Background/shell/${project.id}`);

    directKey.add('MUIVerb', project.name);
    indirectKey.add('MUIVerb', project.name);
    if (project.icon) {
        directKey.add('Icon', project.icon);
        indirectKey.add('Icon', project.icon);
    }
    directKey.add('command');
    indirectKey.add('command');

    let directCommand = registry(`${constants.directoryRegkey}/shell/${project.id}/command`);
    let indirectCommand = registry(`${constants.directoryRegkey}/Background/shell/${project.id}/command`);

    directCommand.add('(Default)', `${location} "%1%"`);
    indirectCommand.add('(Default)', `${location} "%1%"`);
    return true;
}

async function bindDirectoryButtons(project, buttons) {
    let topKey = registry(constants.directoryRegkey); // "HKCR/Directory";
    let indirectTopKey = null; // "HKCR/Directory/Background";

    let directRoot = null; // "HKCR/Directory/shell";
    let indirectRoot = null; // "HKCR/Directory/Background/shell";

    // Recursive create background an shell directory if non-existent, otherwise simply return
    try {
        indirectRoot = registry(`${constants.directoryRegkey}/Background/shell`);
    } catch (e) {
        // Bcakground does not have shell key
        try {
            indirectTopKey = registry(`${constants.directoryRegkey}/Background`);
        } catch (e) {
            // Background does not even exist
            topKey.add('Background');
            indirectTopKey = registry(`${constants.directoryRegkey}/Background`);
        }
        indirectTopKey.add('shell');
        indirectRoot = registry(`${constants.directoryRegkey}/Background/shell`);
    }

    // Recursive create shell directory if non-existent, otherwise simply return
    try {
        directRoot = registry(`${constants.directoryRegkey}/shell`);
    } catch (e) {
        topKey.add('shell');
        directRoot = registry(`${constants.directoryRegkey}/shell`);
    }
    directRoot.add(project.id);
    indirectRoot.add(project.id);

    let directKey = registry(`${constants.directoryRegkey}/shell/${project.id}`);
    let indirectKey = registry(`${constants.directoryRegkey}/Background/shell/${project.id}`);

    directKey.add('MUIVerb', project.name);
    indirectKey.add('MUIVerb', project.name);
    if (project.icon) {
        directKey.add('Icon', project.icon);
        indirectKey.add('Icon', project.icon);
    }
    directKey.add('subcommands', ' ');
    indirectKey.add('subcommands', ' ');

    directKey.add('shell');
    indirectKey.add('shell');

    let directSubcommands = registry(`${constants.directoryRegkey}/shell/${project.id}/shell`);
    let indirectSubcommands = registry(`${constants.directoryRegkey}/Background/shell/${project.id}/shell`);

    buttons.forEach(button => {
        directSubcommands.add(button.id);
        indirectSubcommands.add(button.id);

        let directButton = registry(`${constants.directoryRegkey}/shell/${project.id}/shell/${button.id}`);
        let indirectButton = registry(`${constants.directoryRegkey}/Background/shell/${project.id}/shell/${button.id}`);

        directButton.add('MUIVerb', button.name);
        indirectButton.add('MUIVerb', button.name);
        directButton.add('command');
        indirectButton.add('command');

        let directButtonCommand = registry(`${constants.directoryRegkey}/shell/${project.id}/shell/${button.id}/command`);
        let indirectButtonCommand = registry(`${constants.directoryRegkey}/Background/shell/${project.id}/shell/${button.id}/command`);

        directButtonCommand.add('(Default)', `${button.location} "%1%"`);
        indirectButtonCommand.add('(Default)', `${button.location} "%1%"`);
    });
    return;
}

export async function bindButtons(project, buttons) {
    let ext = project.ext;
    if (project.ext === "[dir]") {
        return bindDirectoryButtons(project, buttons);
    } else if (project.ext !== "*") {
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
        command.add('(Default)', `${button.location} "%1%"`);
    });
}

export async function unbindProject(project) {
    if (project.ext === "[dir]") {
        let directRoot = registry(`${constants.directoryRegkey}/shell/${project.id}`);
        let indirectRoot = registry(`${constants.directoryRegkey}/Background/shell/${project.id}`);
        directRoot.remove();
        indirectRoot.remove();
    } else {
        try {
            let ext = project.ext;
            if (project.ext !== "*") {
                ext = "." + project.ext;
            }
            let root = registry(`${constants.regkey}/${ext}/shell/${project.id}`);
            root.remove();
        } catch (err) { }
    }
}