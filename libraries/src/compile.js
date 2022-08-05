import filesystem from "./filesystem.js";
import { bindButton, bindButtons } from "./binder.js";
import { logVerbose } from "./logger.js";
import chalk from "chalk";
import MenuifyError from "./menuifyError.js";
import { compilePowershell } from "./compilers/powershell.js";
import { compileBatch } from "./compilers/batch.js";
import { compileJavascript } from './compilers/javascript.js';
import { verifySignature } from "./interface/precompiledMenuInterface.js";

export async function compile(project) {
    logVerbose(`Compiling project ${project.id}`);
    logVerbose(`Loading customFS`);
    let projectfs = new filesystem(project, true);

    let error = false;
    // compile and bind buttons
    if (project.cascade) {
        let buttons = [];
        project.buttons.forEach(button => {
            button.location = processButtonTriggers(project, button, projectfs);
            buttons.push({
                id: button.id,
                location: button.location,
                name: button.name
            });
        });
        project.buttons.filter(x => x.type === "precompiled").forEach(button => {
            delete button.action.data;
        });
        await bindButtons(project, buttons);
    } else if (project.buttons && project.buttons.length > 0) {
        let location = processButtonTriggers(project, project.buttons[0], projectfs);
        await bindButton(project, project.buttons[0], location);
    } else {
        logVerbose(`No buttons found for project ${project.id}`);
        error = "Cannot compile project without buttons";
    }

    if (error) {
        logVerbose(`Error compiling project ${project.id}: ${error}`);
        throw new MenuifyError("The project does not contain any buttons to be processed, aborting.", 1302)
    } else {
        projectfs.finalize();
        projectfs.saveManifest();
        console.log(chalk.green("Project compiled successfully"));
    }
}

function processButtonTriggers(project, button, projectfs) {
    logVerbose(`Proccessing triggers for button ${button.id}`);
    let absLocation = "exit";
    if (button.type === "command") {
        // Since this is an executable command, we need to make sure to compile it to a cmd file.
        logVerbose(`Compiling button action for ${button.id}`);
        if (button.action && button.action.command) {
            let langFeatures = getScriptSpecifics();
            absLocation = projectfs.writeFile(button.id + "." + langFeatures.ext, compileCommand(button.action, langFeatures.name));
            absLocation = `"${absLocation}"`;
            if (langFeatures.prefix[langFeatures.prefix.length - 1] !== " ") langFeatures.prefix += " ";
            absLocation = langFeatures.prefix + absLocation;
        }
    } else if (button.type === "program") {
        logVerbose(`Compiling program action trigger for ${button.id}`);
        if (button.action && button.action.program) {
            absLocation = button.action.program;
            absLocation = `"${absLocation}"`;
        }
    } else if (button.type === "precompiled") {
        if (button.action && button.action.data) {
            logVerbose(`Processing precompiled action triggers for ${button.id}`);

            if (project.certificate && button.action.signature) {
                logVerbose(`Verifying signature for ${button.id}`);
                if (verifySignature(button.action.data, button.action.signature, project.certificate)) {
                    logVerbose(`Signature for ${button.id} verified`);
                    try {
                        let buffer = Buffer.from(button.action.data, "base64");
                        let ext = "precompileddata";
                        let prefix = "";
                        if (button.action.type && button.action.type.ext) {
                            ext = button.action.type.ext;
                            prefix = button.action.type.prefix;
                        } else {
                            let langFeatures = getScriptSpecifics(button.action.type.name);
                            ext = langFeatures.ext;
                            prefix = langFeatures.prefix;
                        }
                        absLocation = projectfs.writeFile(button.id + "." + ext, buffer);
                        absLocation = `"${absLocation}"`;
                        if (prefix[prefix.length - 1] !== " ") prefix += " ";
                        absLocation = prefix + absLocation;
                    } catch (e) {
                        throw new MenuifyError(`Error processing precompiled data for ${button.id}: ${e}`, 1305);
                    }
                } else {
                    throw new MenuifyError(`Signature for ${button.id} failed to verify`, 1305);
                }
            } else {
                throw new MenuifyError(`Project ${project.id} contains unsigned precompiled binaries.`, 1305);
            }
        }
    }
    return absLocation;
}

function getScriptSpecifics(customLang) {
    let lang = customLang ?? process.env.SCRIPT_LANG ?? "powershell"

    switch (lang) {
        case "powershell":
            return { name: "powershell", ext: "ps1", prefix: "powershell -file " };
            break;
        case "batch":
            return { name: "batch", ext: "cmd", prefix: "" };
            break;
        case "javascript":
            if (process.env.NODE_PATH) {
                return { name: "javascript", ext: "js", prefix: `"${process.env.NODE_PATH}" ` };
            } else {
                throw new MenuifyError(`Language '${lang}' is not currently available`, 1304);
            }
            break;
        default:
            throw new MenuifyError(`Unknown script language ${lang}`, 1303);
            break;
    }
}

export default function compileCommand(action, lang) {
    /*let script = [];
    script.push("@echo off");
    script.push(":: Generated by Microart Menuify");
    script.push(":: DO NOT EDIT THIS FILE");

    // Menuify styling
    script.push(":: Custom styling");
    script.push("title Menuify - Running command");
    script.push("color 03");
    script.push("mode con: cols=100 lines=4");

    // script setup
    script.push("if exist %1% (");
    script.push("\tgoto okay");
    script.push(")");
    script.push("exit");
    script.push(":okay");
    script.push(`echo Running command '${action.info}', please wait...`);
    script.push(":: Menuify variables");
    script.push("set filename=%1%");
    script.push("set filenameWE=");
    script.push("for %%a in (%filename%) do (@set filenameWE=%%~na)");

    // command to execute
    script.push(action.command.replaceAll("{filename}", "%filename%").replaceAll("{filenameWE}", "%filenameWE%"));

    return script.join("\n");*/
    switch (lang) {
        case "powershell":
            return compilePowershell(action);
            break;
        case "batch":
            return compileBatch(action);
            break;
        case "javascript":
            return compileJavascript(action);
            break;
    }
}