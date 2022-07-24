import chalk from "chalk";
import figlet from "figlet";
import fs from "fs";

let title = "";

export async function docsPage({ inquirer, buffer, readkey, consolekeys, alert }) {
    /*
    figlet.defaults.fontPath = "../fonts/";
    let t = figlet.textSync("Menuify", {
        font: "stampate",
    });
    console.log(t);
    */

    await alert(
        "How to use",
        "Use the left and right arrow keys to focus either the sidebar or content. Then use up and down to either navigate or scroll.",
        ["Okay"]
    );

    buffer.secondary();
    buffer.clear();
    process.stdout.write(consolekeys.hideCursor);
    let loop = true;

    String.prototype.realLength = function () {
        return this.replace(/\x1B\[[0-9;]*?m(?:DA)*/g, "").length;
    }

    let sidebarFocused = false;
    let sidebarHighlightIndex = 0;
    let docFolder = fs.readdirSync(process.cwd() + "/src/docs");

    let selectedDoc = -1;
    //let contentPath = process.cwd() + "/src/docs/" + docFolder[selectedDoc];
    let contentPath = "";
    let selectedDocScroll = 0;

    while (loop) {
        console.clear();
        let vh = process.stdout.rows;
        let vw = process.stdout.columns;
        let grid = 1 / 4;
        let widths = [
            Math.floor(vw * grid) - 1,
            Math.floor(vw * (1 - grid)) - 2
        ];

        let bBuffer = "";

        let sidebarWidth = widths[0] - 2;
        let sidebarHeight = vh - 4;
        let sidebarBuffer = getSidebar(sidebarWidth, sidebarHeight, {
            docFolder,
            focused: sidebarFocused,
            highlightIndex: sidebarHighlightIndex,
            selectedDoc
        });

        let contentWidth = widths[1] - 2;
        let contentHeight = vh - 4;
        let contentBuffer = getContent(contentWidth, contentHeight, {
            index: selectedDoc,
            path: contentPath
        });
        contentBuffer.unshift(" ".repeat(contentWidth));

        for (let i = 0; i < vh; i++) {
            //
            let first = i === 0;
            let last = i === vh - 1;
            //

            let tBuffer = "";

            if (first) {
                let dispTitle = " Microart Documentation Viewer v1";
                if (title !== "")
                    dispTitle += " - " + title;

                let padding = vw - dispTitle.length;
                tBuffer += chalk.bgWhite.black(dispTitle + " ".repeat(padding));
            } else {
                tBuffer += chalk.bgWhite.white(" ");
                let sbBuffer = sidebarBuffer[i - 2];
                if (i >= 2 && i < vh - 1 && sbBuffer) {
                    tBuffer += " ";
                    tBuffer += sbBuffer;
                    tBuffer += " ";
                } else {
                    tBuffer += " ".repeat(widths[0]);
                }
                tBuffer += chalk.bgWhite.white(" ");

                let cBuffer = contentBuffer[i - 1 + selectedDocScroll];
                if (i >= 1 && i < vh - 1 && cBuffer) {
                    tBuffer += " ";
                    if (sidebarFocused)
                        cBuffer = chalk.gray(cBuffer);
                    tBuffer += cBuffer;
                    tBuffer += " ";
                } else {
                    tBuffer += " ".repeat(widths[1]);
                }
                tBuffer += chalk.bgWhite.white(" ");
            }

            if (!last)
                tBuffer += "\n";
            if (first || last)
                tBuffer = chalk.bgWhite.black(tBuffer);
            bBuffer += tBuffer;
        }

        process.stdout.write(bBuffer);

        let rerender = false;

        while (!rerender) {
            // curosr to 0, 0
            process.stdout.write("\x1B[0;0f");
            let key = await readkey();
            switch (key) {
                case consolekeys.left:
                    if (!sidebarFocused) {
                        sidebarFocused = true;
                        rerender = true;
                    }
                    break;
                case consolekeys.right:
                    if (sidebarFocused) {
                        sidebarFocused = false;
                        rerender = true;
                    }
                    break;
                case consolekeys.down:
                    if (sidebarFocused) {
                        if (sidebarHighlightIndex < docFolder.length - 1) {
                            sidebarHighlightIndex++;
                            rerender = true;
                        }
                    } else {
                        if (selectedDocScroll < contentBuffer.length - contentHeight) {
                            selectedDocScroll++;
                            rerender = true;
                        }
                    }
                    break;
                case consolekeys.up:
                    if (sidebarFocused) {
                        if (sidebarHighlightIndex > 0) {
                            sidebarHighlightIndex--;
                            rerender = true;
                        }
                    } else {
                        if (selectedDocScroll > 0) {
                            selectedDocScroll--;
                            rerender = true;
                        }
                    }
                    break;
                case consolekeys.enter:
                    if (sidebarFocused) {
                        selectedDoc = sidebarHighlightIndex;
                        let docName = docFolder[selectedDoc];
                        contentPath = process.cwd() + "/src/docs/" + docName;
                        if (docName.endsWith(".md")) docName = docName.slice(0, -3);
                        title = docName;
                        selectedDocScroll = 0;
                        rerender = true;
                    }
                    break;
                case consolekeys.sigint:
                    loop = false;
                    rerender = true;
                    break;
            }
        }
    }

    buffer.primary();
    console.log(consolekeys.showCursor);
}

function getContent(width, height, { index, path }) {
    let cBuffer = [];
    if (index >= 0) {
        let doc = fs.readFileSync(path);
        let rawLines = doc.toString().split(/\r?\n/);
        let docLines = [];
        rawLines.forEach(l => {
            if (l.length > width) {
                let words = l.split(/ (?=(?:\*\*[^*]+\*\*|\_\_[^_]+\_\_|\*[^*]+\*|\~\~[^~]+\~\~|\`[^`]+\`|[^_*~`])*$)/gm);
                let line = "";
                words.forEach(w => {
                    if (line.realLength() + w.length > width) {
                        docLines.push(line);
                        line = "";
                    }
                    line += w + " ";
                }
                );
                docLines.push(line);
            } else {
                docLines.push(l);
            }
        });
        let isCodeBlock = false;
        docLines.forEach((line, i) => {
            if (line.trimStart().startsWith("#")) {
                line = line.replace("# ", "");
                line = figlet.textSync(line, {
                    font: "big"
                });
                let lines = line.split("\n");
                lines.forEach(l => {
                    cBuffer.push(l.padEnd(width));
                });
            } else {
                let print = true;
                let orig = line;

                if (line.includes("**")) {
                    let reg = /[*]{2}[\S\t ]+[*]{2}/gm;
                    let matches = line.match(reg);
                    if (matches) {
                        matches.forEach(m => {
                            let text = m.replace(/[*]{2}/g, "");
                            line = line.replace(reg, chalk.bold(text));
                        });
                    }
                }
                if (line.includes("*")) {
                    let reg = /[*]{1}[\S\t ]+[*]{1}/gm;
                    let matches = line.match(reg);
                    if (matches) {
                        matches.forEach(m => {
                            let text = m.replace(/[*]{1}/g, "");
                            line = line.replace(reg, chalk.italic(text));
                        });
                    }
                }
                if (line.includes("__")) {
                    let reg = /[_]{2}[\S\t ]+[_]{2}/gm;
                    let matches = line.match(reg);
                    if (matches) {
                        matches.forEach(m => {
                            let text = m.replace(/[_]{2}/g, "");
                            line = line.replace(reg, chalk.underline(text));
                        });
                    }
                }
                if (line.includes("~~")) {
                    let reg = /[~]{2}[\S\t ]+[~]{2}/gm;
                    let matches = line.match(reg);
                    if (matches) {
                        matches.forEach(m => {
                            let text = m.replace(/[~]{2}/g, "");
                            line = line.replace(reg, chalk.strikethrough(text));
                        });
                    }
                }
                if (line.includes("`") && !line.includes("```")) {
                    let reg = /[`]{1}[\S\t ]+[`]{1}/gm;
                    let matches = line.match(reg);
                    if (matches) {
                        matches.forEach(m => {
                            let text = m.replace(/[`]{1}/g, "");
                            line = line.replace(reg, chalk.bgRgb(70,70,70).white(text));
                        });
                    }
                }
                if (line.trimStart().startsWith(">")) {
                    line = line.replace(/[>]/g, "").trim();
                    line += " ";

                    cBuffer.push(null);
                    cBuffer.push(("+-" + "-".repeat(line.realLength()) + "-+").padEnd(width));
                    cBuffer.push("| " + line + " |" + " ".repeat(Math.max(0, width - line.realLength() - 4)));
                    cBuffer.push(("+-" + "-".repeat(line.realLength()) + "-+").padEnd(width));
                    cBuffer.push(null);
                    print = false;
                }

                let isOuterCodeBlock = false;

                if (line.trim().startsWith("```")) {
                    if (!isCodeBlock) {
                        // Start of code block
                        let test = line.replaceAll("```", "").trim();
                        if (test !== "") {
                            line = orig.replaceAll("```", "").trim();
                            line = chalk.italic(line);
                        } else {
                            line = "";
                        }
                    } else {
                        // End of code block
                        line = "";
                    }
                    isCodeBlock = !isCodeBlock;
                    isOuterCodeBlock = true;
                }

                if (isCodeBlock && !isOuterCodeBlock)
                    line = " " + line;

                let formattedLine = line + " ".repeat(Math.max(0, width - line.realLength()));
                if (isCodeBlock && isOuterCodeBlock)
                    formattedLine = chalk.bgRgb(70,70,70).white.underline(formattedLine);
                else if (isOuterCodeBlock || isCodeBlock)
                    formattedLine = chalk.bgRgb(70,70,70).white(formattedLine);

                if (print)
                    cBuffer.push(formattedLine);
            }
        });
    } else {
        cBuffer.push("Welcome to the Menuify Docs!".padEnd(width));
        cBuffer.push("This documentation is made possible by:".padEnd(width));
        cBuffer.push("Microart Documentation Viewer".padEnd(width));
        cBuffer.push(null);
        cBuffer.push("Use arrow keys to navigate".padEnd(width));
        cBuffer.push("Up & Down: Scroll and navigate sidebar".padEnd(width));
        cBuffer.push("Left & Right: Switch focus from sidebar to content".padEnd(width));
        cBuffer.push("Use crtl-c or escape to leave.".padEnd(width));
    }
    return cBuffer;
}

function getSidebar(width, height, { docFolder, focused, highlightIndex, selectedDoc }) {
    //let rootDocs = docFolder.filter(doc => doc.endsWith(".md")).map(doc => doc.slice(0, -3));

    let lBuffer = [];
    lBuffer.push(chalk.underline("Docs Browser".padEnd(width)));
    lBuffer.push(null);
    docFolder.forEach((doc, i) => {
        let docName = doc;
        if (docName.endsWith(".md")) docName = docName.slice(0, -3);

        if (focused && i === highlightIndex)
            docName = " " + docName;

        let docDisp = docName.padEnd(width);

        if (focused) {
            if (i === highlightIndex)
                docDisp = chalk.bgWhite.black.italic(docDisp);
            else if (i === selectedDoc)
                docDisp = chalk.italic(docDisp)
            else
                docDisp = chalk.gray(docDisp);
        } else {
            if (i === selectedDoc)
                docDisp = chalk.bold.italic(docDisp);
            else
                docDisp = chalk.gray(docDisp);
        }
        lBuffer.push(docDisp);
    });

    return lBuffer;
}
