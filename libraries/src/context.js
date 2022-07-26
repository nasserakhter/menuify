import inquirer from "inquirer";
import box from "./gui/box.js";
import { v4 } from "uuid";
import consolekeys from "./consolekeys.js";
import chalk from "chalk";

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

const cursor = {
    home: () => {
        process.stdout.write("\x1B[0;0f");
    },
    set: (x, y) => {
        process.stdout.write(`\x1B[${y};${x}H`);
    },
    hide: () => {
        process.stdout.write(consolekeys.hideCursor);
    },
    show: () => {
        process.stdout.write(consolekeys.showCursor);
    },
    move: (dx, dy) => {
        let data = "";
        if (dx < 0) {
            data += `\x1b${-dx}D`;
        } else if (dx > 0) {
            data += `\x1b${dx}C`;
        }

        if (dy < 0) {
            data += `\x1b${-dy}A`;
        } else if (dy > 0) {
            data += `\x1b${dy}B`;
        }
        process.stdout.write(data);
    }
}

export async function show(func, props) {
    let ctx = {
        inquirer,
        box,
        v4,
        props,
        buffer,
        readkey,
        alert,
        consolekeys,
        cursor
    };
    return await func(ctx);
}

async function readkey() {
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

async function alert(title, message, buttons) {
    buffer.secondary();
    buffer.clear();
    console.log(consolekeys.hideCursor);

    let width = process.stdout.columns;
    let height = process.stdout.rows;

    let minWidth = 70;

    // Split the single lined message into multine on spaces if it exceeds minWidth
    let messageParts = [];
    if (message.length > minWidth) {
        let words = message.split(" ");
        let currentLine = "";
        for (let i = 0; i < words.length; i++) {
            if (currentLine.length + words[i].length + 1 >= minWidth - 2) {
                messageParts.push(currentLine);
                currentLine = "";
            }
            currentLine += words[i] + " ";
        }
        messageParts.push(currentLine);
    }

    let loop = true;
    let focused = Math.min(3, buttons.length - 1);
    title = " " + title + " ";

    let result = -1;
    while (loop) {
        buffer.clear();
        let display = "";

        //
        //
        display += "┌─" + title + "─".repeat(minWidth - (title.length + 4)) + "─┐\n";
        messageParts.forEach(part => {
            display += "│ " + part + " ".repeat(Math.max(0, minWidth - part.length - 4)) + " │\n";
        });
        let buttonsWidth = Math.round((minWidth - 4) / Math.min(4, buttons.length));
        display += "├" + "─".repeat(minWidth - 2) + "┤\n";
        let buttonsDisplay = "";
        let btnsLen = 0;
        for (let i = Math.min(3, buttons.length - 1); i >= 0; i--) {
            let wd = buttonsWidth;
            let button = buttons[i];
            let text = button;
            if (button.length > wd) {
                text = button.substring(0, wd);
            }
            if (button.length < wd) {
                let req = wd - button.length - 3;
                req /= 2;
                text = " ".repeat(Math.floor(req)) + text + " ".repeat(Math.floor(req));
            }
            let dis = " " + text + " ";
            buttonsDisplay += (i === focused) ? chalk.bgWhite.black(dis) : dis;
            btnsLen += dis.length;
        }
        display += "│ " + " ".repeat(Math.max(minWidth - 4 - btnsLen, 0)) + buttonsDisplay + " │\n";
        display += "└" + "─".repeat(minWidth - 2) + "┘\n";

        let pBuffer = display.split("\n");
        let w = minWidth;
        let h = pBuffer.length;
        let padY = Math.floor((height - h) / 2);
        let padX = Math.floor((width - w) / 2);

        let fBuffer = "";
        fBuffer += "\n".repeat(padY);
        pBuffer.forEach(line => {
            fBuffer += " ".repeat(padX) + line + " ".repeat(padX) + "\n";
        });
        fBuffer += "\n".repeat(padY);

        console.log(fBuffer);

        let key = await readkey();
        switch (key) {
            case consolekeys.enter:
                result = focused;
                loop = false;
                break;
            case consolekeys.left:
                if (focused < Math.min(3, buttons.length - 1)) {
                    focused++;
                }
                break;
            case consolekeys.right:
                if (focused > 0) {
                    focused--;
                }
                break;
            case consolekeys.sigint:
                loop = false;
                break;
        }
    }
    console.log(consolekeys.show);
    buffer.primary();
    return buttons[result];
}