import fs from 'fs';
import MenuifyError from './menuifyError.js';
import { logVerbose } from './logger.js';
import path from 'path';
import getDownloadFolder from 'downloads-folder';
import sanitize from 'sanitize-filename';
import { unbindProject } from './binder.js';
import Axios from 'axios';
import ProgressBar from 'progress';
import unzipper from 'unzipper';

export default class filesystem {

    project = null;
    projectDir = null;
    realDir = null;
    partial = false;

    constructor(project, createAsPartial = false) {
        this.project = project;
        this.partial = createAsPartial;
        this.realDir = path.join(filesystem.rootDir, project.id);
        this.projectDir = path.join(filesystem.rootDir, project.id + (createAsPartial ? "-partial" : ""));
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
        let p = path.join(this.projectDir, name);
        fs.writeFileSync(p, content);
        if (this.partial) {
            p = path.join(this.realDir, name);
        }
        return p;
    }

    finalize() {
        if (this.partial) {
            fs.renameSync(this.projectDir, this.realDir);
            this.projectDir = this.realDir;
            this.partial = false;
        }
    }

    saveManifest() {
        this.ensureProjectWritable();
        logVerbose(`Saving manifest...`);
        fs.writeFileSync(path.join(this.projectDir, "manifest.json"), JSON.stringify(this.project));
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
        this.cleanPartialProjects();
    }

    static cleanPartialProjects() {
        let items = fs.readdirSync(filesystem.rootDir);
        items.forEach(item => {
            if (item.length === 44 && item.endsWith("-partial")) {
                let projectDir = path.join(filesystem.rootDir, item);
                if (fs.lstatSync(projectDir).isDirectory()) {
                    fs.rmdirSync(projectDir, { recursive: true });
                    logVerbose(`Deleting unfinished project '${item}'...`);
                }
            }
        });
    }

    static writeRootFile(name, content) {
        logVerbose(`Writing file '${name}'...`);
        let p = path.join(filesystem.rootDir, name);
        fs.writeFileSync(p, content);
        return p;
    }

    static readRootFile(name) {
        logVerbose(`Reading file '${name}'...`);
        let p = path.join(filesystem.rootDir, name);
        return fs.readFileSync(p);
    }

    static rootFileExists(name) {
        return fs.existsSync(path.join(filesystem.rootDir, name));
    }

    static exportProject(project, cPath) {
        logVerbose("Exporting project...");
        let json = JSON.stringify(project);
        let file = path.join(cPath ?? getDownloadFolder(), `${sanitize(project.name)}.menu`);
        fs.writeFileSync(file, json);
        return file;
    }

    static getProjects() {
        logVerbose("Getting projects...");
        let projects = [];
        fs.readdirSync(filesystem.rootDir).forEach(projectDir => {
            if (projectDir.match(filesystem.guidRegex) &&
                fs.lstatSync(path.join(filesystem.rootDir, projectDir)).isDirectory() &&
                fs.existsSync(path.join(filesystem.rootDir, projectDir, "manifest.json"))) {
                let project = JSON.parse(fs.readFileSync(path.join(filesystem.rootDir, projectDir, "manifest.json")));
                projects.push(project);
            }
        });
        return projects;
    }

    static deleteProject(project) {
        logVerbose(`Deleting project '${project.name}'...`);
        fs.rmdirSync(path.join(filesystem.rootDir, project.id), { recursive: true });
        unbindProject(project);
    }

    static async visualDownloadFile(url, name) {
        return new Promise(async (resolve, reject) => {
            let { data, headers } = await Axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });
            let totalLength = headers['content-length'];

            let progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
                width: 40,
                complete: '=',
                incomplete: ' ',
                renderThrottle: 1,
                total: parseInt(totalLength)
            });

            let p = name;
            let writer = fs.createWriteStream(p);

            data.on('data', (chunk) => progressBar.tick(chunk.length));
            data.pipe(writer);
            data.on('end', () => {
                resolve(p);
            });
        });
    }

    static visualExtractOneFileFromZip(file, name, regex) {
        return new Promise((resolve, reject) => {
            let sourcePath = file;
            let targetPath = name;

            let zipfileSize = fs.statSync(sourcePath).size;

            let progressBar = new ProgressBar('-> extracting [:bar] :percent :etas', {
                width: 40,
                complete: '=',
                incomplete: ' ',
                renderThrottle: 1,
                total: zipfileSize
            });

            fs.createReadStream(sourcePath)
                .pipe(unzipper.ParseOne(regex))
                .on('data', chunk => progressBar.tick(chunk.length))
                .pipe(fs.createWriteStream(targetPath))
                .on('close', () => {
                    progressBar.tick(zipfileSize);
                    resolve(targetPath);
                });
        });
    }

    static async httpGet(url) {
        const { data } = await Axios(url);
        return data;
    }
}