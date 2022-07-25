import filesystem from "./filesystem.js";
import { bindButton, bindButtons } from "./binder.js";
import { logVerbose } from "./logger.js";
import chalk from "chalk";
import MenuifyError from "./menuifyError.js";

export async function compile(project) {
    logVerbose(`Compiling project ${project.id}`);
    logVerbose(`Loading customFS`);
    let projectfs = new filesystem(project);

    let error = false;
    // compile and bind buttons
    if (project.cascade) {
        let buttons = [];
        project.buttons.forEach(button => {
            button.location = processButtonTriggers(project, button, projectfs);
            buttons.push(button);
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
        projectfs.saveManifest();
        console.log(chalk.green("Project compiled successfully"));
    }
}

function processButtonTriggers(project, button, projectfs) {
    logVerbose(`Proccessing triggers for button ${button.id}`);
    let absLocation = "";
    if (button.type === "command") {
        // Since this is an executable command, we need to make sure to compile it to a cmd file.
        logVerbose(`Compiling button action for ${button.id}`);
        absLocation = projectfs.writeFile(button.id + ".cmd", compileCommand(button.action));
        console.dir(absLocation);
    }
    return absLocation;
}

export default function compileCommand(action) {
    let script = [];
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

    return script.join("\n");
}