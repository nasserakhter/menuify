let rootDir = "/Users/nasserjaved/Downloads";
let baseDir = "/Users/nasserjaved/Downloads/menuify";
import fs, { existsSync } from "fs";

export function init() {
    if (fs.existsSync(baseDir)) {
    } else {
        fs.mkdirSync(baseDir);
    }
}

function setPath(path) {
    // setx /M path "%path%;%pathsDir%"
}

export function compileFile(projectid, buttonid, script) {
    if (!existsSync(baseDir + "/" + projectid)) {
        fs.mkdirSync(baseDir + "/" + projectid);
    }
    let file = baseDir + "/" + projectid + "/" + buttonid + ".cmd";
    fs.writeFileSync(file, script);
    return file;
}

export function writeManifest(projectid, content) {
    if (!existsSync(baseDir + "/" + projectid)) {
        fs.mkdirSync(baseDir + "/" + projectid);
    }
    let file = baseDir + "/" + projectid + "/" + "manifest" + ".json";
    fs.writeFileSync(file, content);
    return file;
}