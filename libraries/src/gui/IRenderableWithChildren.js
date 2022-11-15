import IRenderable from "./IRenderable.js";

export default class IRenderableWithChildren extends IRenderable {
    children = [];
    focusedChild = -1;


    setChildFocus(index = 0) {
        this.focusedChild = index;
        if (this.children[index]) {
            this.children[index].focus();
        }
    }

    getChildFocus() {
        return this.focusedChild;
    }

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