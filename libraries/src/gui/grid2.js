import chalk from "chalk";
import IRenderableWithChildren from "./IRenderableWithChildren.js";
import { repeat, s } from "./saffronUtils.js";

export default class Grid extends IRenderableWithChildren {
    constructor() {
        super("Grid");
    }

    columns = 3;
    rows = 3;
    gapX = 2;
    gapY = 1;

    render() {
        let { width, height } = this.getSize();

        // Grid
        /*
        First we get the widths of all the children and heights.
        Next we need to see how many objects can fit in the grid horizontally and vertically.
        Then we print
        */

        let cBuffers = this.renderChildren();
        let cSizes = this.getChildrenSizes();

        let cellWidth = Math.floor((width - (this.columns - 1) * this.gapX) / this.columns);
        let cellHeight = Math.floor((height - (this.rows - 1) * this.gapY) / this.rows);

        for (let row = 0; row < this.rows; row++) {
            for (let rowHeight = 0; rowHeight < cellHeight; rowHeight++) {
                let tempBuffer = [];
                for (let col = 0; col < this.columns; col++) {
                    let tempStringBuffer = "";

                    let _cellWidth = cellWidth;

                    if (col === this.columns - 1) {
                        // this is last, check and make sure the column widths + gaps are equal to the width of the grid
                        let totalWidth = cellWidth * this.columns + this.gapX * (this.columns - 1);
                        let remainingWidth = width - totalWidth;
                        _cellWidth += remainingWidth;
                    }

                    //tempStringBuffer += s("", _cellWidth, "A");
                    repeat(_cellWidth, () => {
                        tempStringBuffer += chalk.bgYellow("A");
                    });
                    

                    if (col !== this.columns - 1) {
                        tempStringBuffer += " ".repeat(this.gapX);
                    }

                    tempBuffer.push(tempStringBuffer);
                }
                this.fillOnce(tempBuffer.join(""));
            }
            if (row !== this.rows - 1) {
                for (let gap = 0; gap < this.gapY; gap++) {
                    this.fillOnce(" ");
                }
            }
        }

        //this.fillOnce(largestLength.toString());
        //this.fillOnce(widths.join(","));
    }
}