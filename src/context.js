import inquirer from "inquirer";
import box from "./gui/box.js";
import { v4 } from "uuid";

const buffer = {
    secondary: () => {
        if (!buffer.isPrimary) return;
        console.log("\x1b[?1049h");
        buffer.isPrimary = false;
    },
    primary: () => {
        if (buffer.isPrimary) return;
        console.log("\x1b[?1049l")
        buffer.isPrimary = true;
    },
    clear: () => {
        console.clear();
    },
    isPrimary: true
}

export async function show(func, props) {
    let ctx = {
        inquirer,
        box,
        v4,
        props,
        buffer
    };
    return await func(ctx);
}