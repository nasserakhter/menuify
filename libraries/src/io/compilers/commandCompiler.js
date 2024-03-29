export default function compileCommand(command, meta) {
    let script = [];
    script.push("@echo off");
    script.push(":: Generated by Microart Menuify");
    script.push(":: DO NOT EDIT THIS FILE");
    script.push(":: @meta-start");

    // meta
    script.push(":: project_id=" + meta.project_id);
    script.push(":: button_id=" + meta.button_id);
    script.push(":: @meta-end");

    // script setup
    script.push("if exist %1% (");
    script.push("\t:: Menuify variables");
    script.push("\tset filename=%1%");
    script.push("\tset filenameWE=");
    script.push("\tfor %%a in (%filename%) do (@set filenameWE=%%~na)");

    // command to execute
    script.push("\t" + command.replaceAll("{filename}", "%filename%").replaceAll("{filenameWE}", "%filenameWE%"));

    script.push(")");

    return script.join("\n");
}