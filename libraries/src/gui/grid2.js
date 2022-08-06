import chalk from "chalk";
import IRenderable from "./IRenderable.js";

export default class Grid extends IRenderable {
    constructor() {
        super();
    }

    render() {
        let { width, height } = this.getSize();

        this.fillOnce("Hello world");

        this.fill();

        //this.useTransform(chalk.strikethrough);
    }
}