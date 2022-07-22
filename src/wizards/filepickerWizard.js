import fs from 'fs';
import getDownloadsFolder from 'downloads-folder';
import path from 'path';
import chalk from 'chalk';
import consolekeys from '../consolekeys.js';
import moment from 'moment';

export async function filepickerWizard({ inquirer, buffer }) {
    buffer.secondary();
    buffer.clear();

    let currentDirectory = getDownloadsFolder() + "/test";
    let highlighted = 0;
    let loop = true;
    let marginTop = 5;

    while (loop) {
        try {
            let files = getDirectoryFiles(currentDirectory);
            render(files, {
                highlighted,
                marginTop
            });
            let key = await readKey();

            switch (key) {
                case consolekeys.sigint:
                    loop = false;
                    break;
                case consolekeys.backspace:
                case consolekeys.backspaceWin:
                    currentDirectory = getParentDirectory(currentDirectory);
                    break;
                case consolekeys.up:
                    if (highlighted > 0) {
                        highlighted--;
                    }
                    break;
                case consolekeys.down:
                    if (highlighted < files.length - 1) {
                        highlighted++;
                    }
                    break;
            }
        } catch (e) { }
    }

    buffer.primary();
}

function getDirectoryFiles(directory) {
    let files = fs.readdirSync(directory);
    let result = [];
    files.forEach(file => {
        let filePath = directory + "/" + file;
        let stat = fs.statSync(filePath);
        let isDirectory = stat.isDirectory();
        let size = stat.size;
        let modified = moment(stat.mtime);
        result.push({
            name: file,
            extension: path.extname(file),
            isDirectory,
            size,
            modified
        });
    });
    return result;
}

function getParentDirectory(directory) {
    let dir = directory.substring(0, directory.lastIndexOf(path.sep));
    dir = dir === "" ? "/" : dir;
    return dir;
}

let dispIndex = 0;

function render(files, { highlighted, marginTop }) {
    console.clear();
    let col = process.stdout.columns;
    let row = process.stdout.rows;
    let max = Math.min(files.length, row - marginTop);
    if (highlighted >= (max + dispIndex)) {
        dispIndex = highlighted - max + 1;
    }
    if (highlighted < dispIndex) {
        dispIndex = highlighted;
    }

    let seperate = col / 4;

    let buffer = "";
    for (let i = 0; i < max; i++) {
        let realIndex = i + dispIndex;
        if (realIndex === highlighted) {
            let tempBuffer = generateFileInfo(files[realIndex], seperate);
            buffer += chalk.bgWhite(tempBuffer);
            buffer += "\n";
        } else {
            buffer += generateFileInfo(files[realIndex], seperate);
            buffer += "\n";
        }
    }
    process.stdout.write(buffer);
}

function generateFileInfo(file, seperate) {
    let buffer = "";
    buffer += " ";
    let isDirectory = file.isDirectory ? "*dir" : "file";
    buffer += isDirectory;
    buffer += "   ";

    let rawName = file.name;
    if (rawName.length > seperate + 2) {
        let didRemoveExtension = false;
        if (file.isDirectory) {
            let extensionIndex = rawName.lastIndexOf(".");
            if (extensionIndex > 0) {
                didRemoveExtension = true;
                rawName = rawName.substring(0, extensionIndex);
            }
        }

    }
    let name = file.isDirectory ? chalk.cyan(rawName.padEnd(seperate)) : rawName.padEnd(seperate);;
    buffer += name;
    let modified = file.modified.format("MMM Do, YYYY hh:mm A");
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
    }
    return buffer;
}

async function readKey() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    return new Promise(resolve => {
        process.stdin.once('data', (data) => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            resolve(data.toString());
        });
    });
}