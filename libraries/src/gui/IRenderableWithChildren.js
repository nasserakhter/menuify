import IRenderable from "./IRenderable.js";

export default class IRenderableWithChildren extends IRenderable {
    children = [];

    renderChildren() {
        return this.children.map(child => child.invokeRender());
    }

    getChildrenSizes() {
        return this.children.map(child => {
            return {
                height: child.lastBuffer.length,
                width: child._calculateRealWidth
            }
        });
    }
}