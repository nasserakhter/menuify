import chalk from "chalk";

import { s, useRealLength } from "./saffronUtils.js";

export default function grid(children, options) {
    useRealLength(true);

    children = children ?? [];
    options = options || {};

    let rBuffer = [];
    let bBuffer = [];

    let border = options.border ?? false;

    let drawingSymbols = border ? {
        left: "│",
        right: "│",
        top: "─",
        bottom: "─",
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        intersectLeft: "├",
        intersectRight: "┤",
        intersectTop: "┬",
        intersectBottom: "┴",
        intersectAll: "┼"
    } : {
        left: " ",
        right: " ",
        top: " ",
        bottom: " ",
        topLeft: " ",
        topRight: " ",
        bottomLeft: " ",
        bottomRight: " ",
        intersectLeft: " ",
        intersectRight: " ",
        intersectTop: " ",
        intersectBottom: " ",
        intersectAll: " "
    };

    let margin = options.margin ?? 0;

    // No negative margin 
    margin = typeof margin === "number" ? Math.max(margin, 0) : margin;

    let marginX = options.marginX ?? (typeof margin === "string" ? margin : Math.floor(margin / 2));
    let marginY = options.marginY ?? (typeof margin === "string" ? margin : Math.floor(margin / 2));
    let marginLeft = options.marginLeft ?? marginX;
    let marginRight = options.marginRight ?? marginX;
    let marginTop = options.marginTop ?? marginY;
    let marginBottom = options.marginBottom ?? marginY;

    let viewportRealWidth = options.width ?? process.stdout.columns;
    let viewportRealHeight = options.height ?? process.stdout.rows;


    // preserve transform
    let _marginLeft = marginLeft;
    let _marginTop = marginTop;
    let _marginRight = marginRight;
    let _marginBottom = marginBottom;

    if (typeof marginLeft === "string") {
        marginLeft = 0;
    }
    if (typeof marginTop === "string") {
        marginTop = 0;
    }
    if (typeof marginRight === "string") {
        marginRight = 0;
    }
    if (typeof marginBottom === "string") {
        marginBottom = 0;
    }


    let viewportWidth = viewportRealWidth;
    viewportWidth -= marginLeft + marginRight;

    let viewportHeight = viewportRealHeight;
    viewportHeight -= marginTop + marginBottom;

    let _maxWidth = options.maxWidth ?? viewportWidth;
    let _maxHeight = options.maxHeight ?? viewportHeight;

    if (typeof _maxWidth === "string") {
        if (_maxWidth.endsWith("%")) {
            _maxWidth = Math.floor(viewportWidth * parseFloat(_maxWidth) / 100);
        }
    }
    if (typeof _maxHeight === "string") {
        if (_maxHeight.endsWith("%")) {
            _maxHeight = Math.floor(viewportHeight * parseFloat(_maxHeight) / 100);
        }
    }

    let maxWidth = Math.min(_maxWidth, viewportWidth) || viewportWidth;
    maxWidth = Math.max(maxWidth - 8, 0);

    let maxHeight = Math.min(_maxHeight, viewportHeight) || viewportHeight;
    maxHeight = Math.max(maxHeight - 8, 0);

    let runSpacingX = options.gapX ?? 1;
    let runSpacingY = options.gapY ?? 1;

    let longestChildWidth = children.reduce((max, child) => {
        return Math.max(child.reduce((cMax, line) => {
            return Math.max(cMax, line.toString().realLength());
        }, 0), max);
    }, 0) || 5;

    let longestChildHeight = children.reduce((max, child) => {
        return Math.max(child.length, max);
    }, 0) || 3;

    longestChildWidth = Math.min(((options.maxCellWidth ?? Number.MAX_SAFE_INTEGER) + (runSpacingX * 2)), longestChildWidth);
    longestChildHeight = Math.min(((options.maxCellHeight ?? Number.MAX_SAFE_INTEGER) + (runSpacingY * 2)), longestChildHeight);

    longestChildWidth = Math.max(longestChildWidth, options.minCellWidth ?? 0);
    longestChildHeight = Math.max(longestChildHeight, options.minCellHeight ?? 0);

    longestChildWidth = Math.max(options.cellWidth, 0) || longestChildWidth;
    longestChildHeight = Math.max(options.cellHeight, 0) || longestChildHeight;


    let runsX = Math.floor(maxWidth / longestChildWidth);
    runsX = Math.max(runsX, (options.minColumns ?? Number.MIN_SAFE_INTEGER));
    runsX = Math.min(runsX, (options.maxColumns ?? Number.MAX_SAFE_INTEGER));
    runsX = Math.max(options.columns, 0) || runsX;

    let runsY = children.length > runsX ? Math.ceil(children.length / runsX) : 1;
    runsY = Math.max(runsY, (options.minRows ?? Number.MIN_SAFE_INTEGER));
    runsY = Math.min(runsY, (options.maxRows ?? Number.MAX_SAFE_INTEGER));
    runsY = Math.max(options.rows, 0) || runsY;

    let maxRunWidth = options.maxCellWidth ?? longestChildWidth;
    let maxRunHeight = options.maxCellHeight ?? longestChildHeight;

    if (runsX * maxRunWidth > maxWidth) {
        maxRunWidth = Math.floor(maxWidth / runsX);
    }

    if (runsY * maxRunHeight > maxHeight) {
        maxRunHeight = Math.floor(maxHeight / runsY);
    }

    let runWidth = Math.min(longestChildWidth, maxRunWidth);

    let runHeight = Math.min(longestChildHeight, maxRunHeight);

    runSpacingX *= 2;
    //runWidth *= 2;

    //let renderWidth = runsX * (runWidth + runSpacing) - runSpacing;
    let renderWidth = (runSpacingX < 1 ? 0 : (((runsX + 1) * runSpacingX) - 2)) + (runsX * runWidth);
    let renderHeight = (runSpacingY < 1 ? 0 : (((runsY + 1) * runSpacingY) - 2)) + (runsY * runHeight);

    if (typeof _marginLeft === "string") {
        let emptySpace = viewportRealWidth - (renderWidth + 2);
        marginLeft = Math.floor(emptySpace / 2);
    }
    if (typeof _marginTop === "string") {
        let emptySpace = viewportRealHeight - (renderHeight + 2);
        marginTop = Math.floor(emptySpace / 2);
    }
    if (typeof _marginRight === "string") {
        let emptySpace = viewportRealWidth - (renderWidth + 2);
        marginRight = Math.floor(emptySpace / 2);
    }
    if (typeof _marginBottom === "string") {
        let emptySpace = viewportRealHeight - (renderHeight + 2);
        marginBottom = Math.floor(emptySpace / 2);
    }

    let debug = options.debug ?? false;

    for (let i = 0; i < marginTop; i++) {
        bBuffer.push(" ".repeat(viewportRealWidth));
    }

    let header = drawingSymbols.topLeft + drawingSymbols.top.repeat(renderWidth) + drawingSymbols.topRight;
    if (debug) {
        // +2 to account for the drawn border
        let debugSizeText = chalk.magenta(` ${renderWidth + 2}x${renderHeight + 2} `);
        let debugElementText = chalk.cyan(` saffron.grid `);
        if (debugSizeText.realLength() + debugElementText.realLength() + 4 <= header.realLength()) {
            header = header.substring(0, Math.max(2, (header.length - 2 - debugSizeText.realLength()))) +
                debugSizeText +
                header.substring(header.length - 2, header.length);

            header = header.substring(0, 2) +
                debugElementText +
                header.substring(2 + debugElementText.realLength(), header.length);
        } else {
            header = header + debugElementText + debugSizeText.replace(" ", "");
        }
    }

    rBuffer.push(header);
    //rBuffer.push(drawingSymbols.left + " ".repeat(renderWidth + (runSpacing * 2)) + drawingSymbols.right);

    for (let y = 0; y < runsY; y++) {
        if (y === 0) {
            for (let r = 0; r < Math.max(runSpacingY - 1, 0); r++) {
                rBuffer.push(drawingSymbols.left + " ".repeat(renderWidth) + drawingSymbols.right);
            }
        }

        for (let i = 0; i < runHeight; i++) {
            let line = "";

            line += drawingSymbols.left;
            for (let x = 0; x < runsX; x++) {
                if (x == 0) {
                    line += " ".repeat(Math.max(runSpacingX - 1, 0));
                }

                let child = children[(y * runsX) + x];
                if (child) {
                    let content = child[i];
                    if (content !== undefined && content !== null) {
                        content = content.toString();
                        //line += chalk.bgGreen(" ".repeat(runWidth));
                        let formatted = content.realLength() > runWidth ?
                            content.substring(0, runWidth) :
                            s(content, runWidth);

                        if (options.checkerboard) {
                            let isEven;
                            if (runsX % 6 === 0) {
                                isEven = ((y * runsX) + x + (y % 2)) % 2 === 0;
                            } else {
                                isEven = ((y * runsX) + x) % 2 === 0;
                            }
                            if (isEven) {
                                formatted = (options.evenColor ?? chalk.bgRgb(13, 2, 33))(formatted);
                            } else {
                                formatted = (options.oddColor ?? chalk.bgRgb(105, 109, 125))(formatted);
                            }
                        }
                        line += formatted;
                    } else {
                        let placeholder = "";
                        if (debug) {
                            let text = "BLANK CHILD CONTENT ";
                            text = text.repeat(Math.ceil(runWidth / text.realLength()));
                            text = text.substring(0, runWidth);
                            placeholder = chalk.cyan(text);
                            line += chalk.bgRgb(0, 40, 70)(placeholder);
                        } else {
                            placeholder = " ".repeat(runWidth);
                            if (options.checkerboard) {
                                let isEven;
                                if (runsX % 6 === 0) {
                                    isEven = ((y * runsX) + x + (y % 2)) % 2 === 0;
                                } else {
                                    isEven = ((y * runsX) + x) % 2 === 0;
                                }
                                if (isEven) {
                                    placeholder = (options.evenColor ?? chalk.bgRgb(13, 2, 33))(placeholder);
                                } else {
                                    placeholder = (options.oddColor ?? chalk.bgRgb(105, 109, 125))(placeholder);
                                }
                            }
                            line += placeholder;
                        }
                    }
                } else {
                    let placeholder = "";
                    if (debug) {
                        let text = "NO CHILD ONLY SPACER ";
                        text = text.repeat(Math.ceil(runWidth / text.realLength()));
                        text = text.substring(0, runWidth);
                        placeholder = chalk.gray(text);
                        line += chalk.bgRgb(40, 40, 40)(placeholder);
                    } else {
                        placeholder = " ".repeat(runWidth);
                        if (options.checkerboard) {
                            let isEven;
                            if (runsX % 6 === 0) {
                                isEven = ((y * runsX) + x + (y % 2)) % 2 === 0;
                            } else {
                                isEven = ((y * runsX) + x) % 2 === 0;
                            }
                            if (isEven) {
                                placeholder = (options.evenColor ?? chalk.bgRgb(13, 2, 33))(placeholder);
                            } else {
                                placeholder = (options.oddColor ?? chalk.bgRgb(105, 109, 125))(placeholder);
                            }
                        }
                        line += placeholder;
                    }
                }

                if (x == runsX - 1) {
                    line += " ".repeat(Math.max(runSpacingX - 1, 0));
                } else {
                    line += " ".repeat(runSpacingX);
                }
            }
            line += drawingSymbols.right;
            rBuffer.push(line);
        }

        if (y < runsY - 1) {
            for (let r = 0; r < runSpacingY; r++) {
                rBuffer.push(drawingSymbols.left + " ".repeat(renderWidth) + drawingSymbols.right);
            }
        } else if (y === runsY - 1) {
            for (let r = 0; r < Math.max(runSpacingY - 1, 0); r++) {
                rBuffer.push(drawingSymbols.left + " ".repeat(renderWidth) + drawingSymbols.right);
            }
        }
    }

    rBuffer.push(drawingSymbols.bottomLeft + drawingSymbols.bottom.repeat(renderWidth) + drawingSymbols.bottomRight);

    rBuffer = rBuffer.map(line => " ".repeat(Math.min(Math.max(marginLeft, 0), viewportRealWidth - renderWidth - 2)) + line);

    bBuffer = bBuffer.concat(rBuffer);

    useRealLength(false);

    return bBuffer;
}