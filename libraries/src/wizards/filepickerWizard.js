import fs from 'fs';
import getDownloadsFolder from 'downloads-folder';
import path from 'path';
import chalk from 'chalk';
import consolekeys from '../consolekeys.js';
import moment from 'moment';
import { execSync } from 'child_process';

let dispIndex = 0;

export async function filepickerWizard({ readkey, buffer, props }) {
    buffer.secondary();
    buffer.clear();
    console.log(consolekeys.hideCursor);

    let currentDirectory = getDownloadsFolder();
    //let currentDirectory = "E:";
    let highlighted = 0;
    let loop = true;
    let marginTop = 6;
    let showHidden = false;
    let firstRun = true;
    let selectedFile = null;
    let filters = [];
    let title = "";

    if (props && props.filters) filters = props.filters;
    if (props && props.title) title = props.title;

    while (loop) {
        if (currentDirectory.match(/^[A-Za-z]:$/)) {
            currentDirectory += "\\";
        }
        try {
            let files = getDirectoryFiles(currentDirectory, filters);
            //let nonHiddenIndexes = files.map((f,i) => {f.i = i; return f;}).filter(f => !f.hidden).map(f => f.i);
            if (firstRun) {
                highlighted = showHidden ? 0 : files.findIndex(file => !file.hidden);
                firstRun = false;
                dispIndex = highlighted;
            }
            render(files, {
                highlighted,
                marginTop,
                showHidden,
                directory: currentDirectory,
                filters,
                title
            });
            process.stdout.write("\x1B[0;0f");
            let key = await readkey();

            switch (key) {
                case consolekeys.sigint:
                    loop = false;
                    selectedFile = null;
                    break;
                case consolekeys.backspace:
                case consolekeys.backspaceWin:
                    firstRun = true;
                    currentDirectory = getParentDirectory(currentDirectory);
                    break;
                case consolekeys.up:
                    if (highlighted > 0) {
                        if (showHidden) {
                            highlighted--;
                        } else {
                            let index = -1;
                            let found = false;
                            for (let i = highlighted - 1; i >= 0; i--) {
                                if (!found) {
                                    if (!files[i].hidden) {
                                        index = i;
                                        found = true;
                                    }
                                }
                            }
                            if (index >= 0) {
                                highlighted = index;
                            }
                        }
                    }
                    break;
                case consolekeys.h:
                case consolekeys.H:
                    showHidden = !showHidden;
                    firstRun = true;
                    break;
                case consolekeys.down:
                    if (highlighted < files.length - 1) {
                        // dont select hidden files
                        if (showHidden) {
                            highlighted++;
                        } else {
                            let index = -1;
                            let found = false;
                            for (let i = highlighted + 1; i < files.length; i++) {
                                if (!found) {
                                    if (!files[i].hidden) {
                                        index = i;
                                        found = true;
                                    }
                                }
                            }
                            if (index > -1) {
                                highlighted = index;
                            }
                        }
                    }
                    break;
                case consolekeys.enter:
                    let file = files[highlighted].path;
                    let stats = fs.statSync(file);
                    if (stats.isDirectory()) {
                        currentDirectory = file;
                        firstRun = true;
                    } else {
                        selectedFile = file;
                        loop = false;
                    }
                    break;
            }
        } catch (e) {
            console.clear();
            console.log(e);
            console.log("Press any key");
            await readkey();
            loop = false;
        }
    }

    buffer.primary();
    console.log(consolekeys.showCursor);
    return selectedFile;
}

function getDrives() {
    return execSync('wmic logicaldisk get name')
        .toString()
        .split('\r\r\n')
        .filter(value => /[A-Za-z]:/.test(value))
        .map(value => value.trim() + "\\");
}

function getDirectoryFiles(directory, filters) {
    let files = [];
    let result = [];
    if (directory === "/") {
        files = getDrives();
        files.forEach(drive => {
            result.push({
                name: drive,
                path: drive,
                hidden: false,
                modified: moment(),
                isDirectory: true
            });
        });
    } else {
        files = fs.readdirSync(directory);
        files.forEach(file => {
            try {
                if (file) {
                    let filePath = path.join(directory, file);
                    let extension = path.extname(file);
                    let stat = fs.lstatSync(filePath);
                    let isDirectory = stat.isDirectory();
                    let allow = false;
                    if (filters.length > 0) {
                        if (filters.includes(extension.replaceAll(".", ""))) {
                            allow = true;
                        }
                    } else {
                        allow = true;
                    }
                    if (isDirectory) allow = true;
                    if (file === ".DS_Store") allow = false;
                    if (allow) {
                        /*
                        let stat = fs.statSync(filePath);
                        let isDirectory = stat.isDirectory();
                        let size = stat.size;
                        le t  modified = moment(stat.mtime);
                        */
                        let size = stat.size;
                        let modified = moment(stat.mtime);
                        let hidden = file.startsWith(".");
                        result.push({
                            name: file,
                            path: filePath,
                            extension,
                            isDirectory,
                            size,
                            modified,
                            hidden
                        });
                    }
                }
            } catch (e) { }
        });
    }
    return result;
}

function getParentDirectory(directory) {
    let k = "";
    if (directory.match(/^[A-Za-z]:\\$/)) {
        k = "/";
    } else {
        let dir = directory.substring(0, directory.lastIndexOf(path.sep));
        dir = dir === "" ? "/" : dir;
        k = dir;
    }
    return k;
}

function render(files, { highlighted, marginTop, showHidden, directory, filters, title }) {
    console.clear();
    let col = process.stdout.columns;
    let row = process.stdout.rows;
    let length = showHidden ? files.length : files.filter(f => !f.hidden).length;
    let max = Math.min(length, row - marginTop);
    if (highlighted >= (max + dispIndex)) {
        dispIndex = highlighted - max + 1;
    }
    if (highlighted < dispIndex) {
        dispIndex = highlighted;
    }

    let seperate = col / 4;
    let buffer = "";
    buffer += chalk.bgWhite.black((" Microart Terminal File Picker v1" + (title === "" ? "" : "  |  " + title)).padEnd(col - 1) + " \n");
    buffer += `${chalk.bold(" Shortcuts")} : ${chalk.magenta("[h]")} Toggle show hidden files - ${chalk.magenta("[backspace]")}  Go to parent folder - ${chalk.magenta("[enter]")}  View folder or select file\n`;
    buffer += ` Viewing (${filters.join()}) -> ${directory}\n`;
    buffer += ("      " + `File name [${highlighted + 1}/${files.length}] ${showHidden ? "" : "(some files hidden)"}`.padEnd(seperate) + "Date modified".padEnd(seperate) + "Size".padEnd(seperate)).padEnd(col - 1) + "\n";
    buffer += "-".repeat(col - 1) + "\n";

    for (let i = 0; i < max; i++) {
        let realIndex = i + dispIndex;
        let file = files[realIndex];
        if (file && (showHidden || !file.hidden)) {
            if (realIndex === highlighted) {
                let tempBuffer = generateFileInfo(file, seperate);
                buffer += chalk.bgWhite.black(tempBuffer);
                buffer += "\n";
            } else {
                buffer += generateFileInfo(file, seperate);
                buffer += "\n";
            }
        }
    }
    process.stdout.write(buffer);
}

function generateFileInfo(file, seperate) {
    let buffer = "";
    buffer += " ";

    let rawName = file.name;
    if (rawName.length > seperate - 2) {
        let didRemoveExtension = false;
        if (!file.isDirectory) {
            let extensionIndex = rawName.lastIndexOf(".");
            if (extensionIndex > 0) {
                didRemoveExtension = true;
                rawName = rawName.substring(0, extensionIndex);
            }
        }
        rawName = rawName.substring(0, seperate - 3 - file.extension.length);
        rawName += "\u2026";

        if (didRemoveExtension) {
            rawName += file.extension;
        }
    }
    buffer += file.isDirectory ? chalk.magenta(" dir ") : chalk.yellow("file ");
    let name = file.isDirectory ? chalk.cyan(rawName.padEnd(seperate)) : chalk.green(rawName.padEnd(seperate));
    buffer += name;
    let modified = moment(file.modified).format("MMM Do, YYYY h:mm A");
    buffer += modified.padEnd(seperate);
    if (!file.isDirectory) {
        let size = file.size;
        let iterations = 0;
        let suffix = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let loop = true;
        while (loop) {
            if (size < 1024) {
                loop = false;
            } else {
                size /= 1000;
                iterations++;
            }
        }
        let sizeString = size.toFixed(1) + " " + suffix[iterations];
        buffer += sizeString.padEnd(seperate);
    } else {
        buffer += "".padEnd(seperate);
    }
    return buffer;
}