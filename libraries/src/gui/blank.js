import IRenderable from "./IRenderable.js";

export default class Blank extends IRenderable {
    constructor() {
        super("Blank");
    }

    render() {
        this.fill("D");
    }
}