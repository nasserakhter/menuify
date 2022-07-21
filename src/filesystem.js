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
        return `${this.projectDir}/${name}`;
    }

    saveManifest() {
        this.ensureProjectWritable();
        logVerbose(`Saving manifest...`);
        fs.writeFileSync(`${this.projectDir}/manifest.json`, JSON.stringify(this.project));
    }

    static rootDir = "";
    static guidRegex = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/gm;

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

    static getProjects() {
        logVerbose("Getting projects...");
        let projects = [];
        fs.readdirSync(filesystem.rootDir).forEach(projectDir => {
            if (projectDir.match(filesystem.guidRegex) &&
                fs.lstatSync(`${filesystem.rootDir}/${projectDir}`).isDirectory() &&
                fs.existsSync(`${filesystem.rootDir}/${projectDir}/manifest.json`)) {
                let project = JSON.parse(fs.readFileSync(`${filesystem.rootDir}/${projectDir}/manifest.json`));
                projects.push(project);
            }
        });
        return projects;
    }

    static deleteProject(project) {
        logVerbose(`Deleting project '${project.name}'...`);
        fs.rmdirSync(`${filesystem.rootDir}/${project.id}`, { recursive: true });
    }
}