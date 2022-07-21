import fs from 'fs';
import MenuifyError from './menuifyError.js';
import { logVerbose } from './logger.js';

export default class filesystem {

    project = null;
    projectDir = null;

    constructor(project) {
        this.project = project;
        this.projectDir = `${filesystem.rootDir}/${project.id}`;
    }

    ensureProjectWritable() {
        if (fs.existsSync(this.projectDir)) {
            logVerbose("Project directory exists, no need to create new one.");
        } else {
            try {
                fs.mkdirSync(this.projectDir);
                logVerbose("Project directory not found, created new one.");
            } catch (e) {
                throw new MenuifyError(`[!] ERROR 3603: Could not create project directory '${this.projectDir}'`, 3602);
            }
        }
    }

    writeFile(name, content) {
        this.ensureProjectWritable();
        logVerbose(`Writing file '${name}'...`);
        fs.writeFileSync(`${this.projectDir}/${name}`, content);
    }

    saveManifest() {
        this.ensureProjectWritable();
        logVerbose(`Saving manifest...`);
        fs.writeFileSync(`${this.projectDir}/manifest.json`, JSON.stringify(this.project));
    }

    static rootDir = "";

    static initialize(rootDir) {
        logVerbose("Initializing filesystem...");
        filesystem.rootDir = rootDir;
        if (!fs.existsSync(rootDir)) {
            try {
                fs.mkdirSync(rootDir);
                logVerbose("Root directory not found, created new one.");
            } catch (e) {
                throw new MenuifyError(`[!] ERROR 3602: Could not create root directory '${rootDir}'`, 3602);
            }
        } else {
            logVerbose("A root directory already exists, no need to create new one.");
        }
    }
}