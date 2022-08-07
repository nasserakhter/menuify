import chalk from "chalk";
import IRenderable from "./IRenderable.js";

export default class Grid extends IRenderable {
    constructor() {
        super();
    }

    render() {
        let { width, height } = this.getSize();

        this.fillOnce("Hello world");

        for (let i = 0; i < height * 3; i++) {
            this.fillOnce("H".repeat(width));
        }

        //this.useTransform(chalk.strikethrough);
    }
}