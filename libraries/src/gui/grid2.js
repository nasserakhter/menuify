import chalk from "chalk";
import IRenderableWithChildren from "./IRenderableWithChildren.js";
import { repeat, s, sizeTo } from "./saffronUtils.js";

export default class Grid extends IRenderableWithChildren {
    constructor() {
        super("Grid");
    }

    //columns = this.sizes.UNSET;
    //rows = this.sizes.UNSET;
    columns = 3;
    rows = 3;
    gapX = 1;
    gapY = 1;
    gapRatio = [2, 1]; // Normalize gaps
    lastRowFill = true;
    lastColumnFill = true;

    getSizingType() {
        if (this.columns === this.sizes.UNSET) {
        }
        if (this.rows === this.sizes.UNSET) {
        }

    }

    getCellSize() {
        let { width, height } = this.getSize();
        return {
            cellWidth: Math.floor((width - (this.columns - 1) * this.gapX) / this.columns),
            cellHeight: Math.floor((height - (this.rows - 1) * this.gapY) / this.rows)
        }
    }

    getLastRowPadding(cellHeight, height) {
        return this.lastRowFill ?
            (cellHeight + (height - (cellHeight * this.rows + this.gapY * (this.rows - 1)))) :
            cellHeight;
    }

    getLastColumnPadding(cellWidth, width) {
        return this.lastColumnFill ?
            (cellWidth + (width - (cellWidth * this.columns + this.gapX * (this.columns - 1)))) :
            cellWidth;
    }

    getGap() {
        return {
            gapX: this.gapX * this.gapRatio[0],
            gapY: this.gapY * this.gapRatio[1]
        }
    }


    render() {
        let { width, height } = this.getSize();
        let { cellWidth, cellHeight } = this.getCellSize();
        let { gapX, gapY } = this.getGap();

        let childBuffers = [];
        repeat(this.rows, (currentRow) => {

            let _cellHeight = cellHeight;
            if (currentRow.isLast) {
                _cellHeight = this.getLastRowPadding(cellHeight, height);
            }

            repeat(this.columns, (currentColumn) => {
                let _cellWidth = cellWidth;
                if (currentColumn.isLast) {
                    _cellWidth = this.getLastColumnPadding(cellWidth, width);
                }

                let child = this.children[currentRow.index * this.columns + currentColumn.index];

                if (child) {
                    child.setViewport(_cellWidth, _cellHeight);
                    childBuffers.push(child.invokeRender());
                }
            });
        });

        repeat(this.rows, (currentRow) => {
            let _cellHeight = cellHeight;

            if (currentRow.isLast) {
                _cellHeight = this.getLastRowPadding(cellHeight, height);
            }

            repeat(_cellHeight, (pixelRow) => {
                let tempBuffer = [];

                repeat(this.columns, (currentColumn) => {
                    let tempStringBuffer = "";
                    let _cellWidth = cellWidth;

                    if (currentColumn.isLast) {
                        _cellWidth = this.getLastColumnPadding(cellWidth, width);
                    }

                    let child = childBuffers[currentRow.index * this.columns + currentColumn.index];

                    if (child) {
                        tempStringBuffer += sizeTo(_cellWidth, child[pixelRow.index]);
                    } else {
                        repeat(_cellWidth, () => {
                            tempStringBuffer += chalk.green("H");
                        });
                    }

                    if (!currentColumn.isLast) {
                        tempStringBuffer += " ".repeat(gapX);
                    }

                    tempBuffer.push(tempStringBuffer);
                });

                this.fillOnce(tempBuffer.join(""));
            });

            if (!currentRow.isLast) {
                repeat(gapY, () => {
                    this.fillOnce(" ");
                });
            }

        });
    }
}