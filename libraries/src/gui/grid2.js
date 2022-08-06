import IRenderable from "./IRenderable.js";

export default class Grid extends IRenderable {
    constructor() {
        super();
    }

    render() {
        let { width, height } = this.getSize();

        this.fill("transformer , haaa");
    }
}