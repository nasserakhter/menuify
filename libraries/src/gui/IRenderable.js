import { s, useRealLength } from "./saffronUtils.js";

export default class IRenderable {
    constructor(viewport) {
        if (viewport) {
            this._nominal.viewportWidth = viewport.width ?? this.sizes.UNSET;
            this._nominal.viewportHeight = viewport.height ?? this.sizes.UNSET;
        }
    }

    margins = {
        AUTO: 'auto',
        NONE: 0
    };

    sizes = {
        AUTO: 'auto',
        UNSET: null
    }

    _nominal = {
        margin: {
            top: this.margins.NONE,
            right: this.margins.NONE,
            bottom: this.margins.NONE,
            left: this.margins.NONE
        },

        border: {
            top: this.margins.NONE,
            right: this.margins.NONE,
            bottom: this.margins.NONE,
            left: this.margins.NONE
        },

        width: this.sizes.AUTO,
        height: this.sizes.AUTO,

        minWidth: this.sizes.UNSET,
        minHeight: this.sizes.UNSET,
        maxWidth: this.sizes.UNSET,
        maxHeight: this.sizes.UNSET,

        viewportWidth: this.sizes.UNSET,
        viewportHeight: this.sizes.UNSET,

        aBuffer: []
    }

    getMargin() {
        return {
            top: this._nominal.margin.top,
            right: this._nominal.margin.right,
            bottom: this._nominal.margin.bottom,
            left: this._nominal.margin.left,
            x: this._nominal.margin.left + this._nominal.margin.right,
            y: this._nominal.margin.top + this._nominal.margin.bottom
        }
    }

    getBorder() {
        return {
            top: this._nominal.border.top,
            right: this._nominal.border.right,
            bottom: this._nominal.border.bottom,
            left: this._nominal.border.left,
            x: this._nominal.border.left + this._nominal.border.right,
            y: this._nominal.border.top + this._nominal.border.bottom
        }
    }

    useConsoleViewport() {
        this._nominal.viewportWidth = process.stdout.columns;
        this._nominal.viewportHeight = process.stdout.rows;
    }

    setViewport(viewport) {
        this._nominal.viewportWidth = viewport.width ?? this.sizes.UNSET;
        this._nominal.viewportHeight = viewport.height ?? this.sizes.UNSET;
    }

    setViewport(width, height) {
        this._nominal.viewportWidth = width ?? this.sizes.UNSET;
        this._nominal.viewportHeight = height ?? this.sizes.UNSET;
    }

    getViewport() {
        let width = this._nominal.viewportWidth === this.sizes.UNSET ? process.stdout.columns : this._nominal.viewportWidth;
        let height = this._nominal.viewportHeight === this.sizes.UNSET ? process.stdout.rows : this._nominal.viewportHeight;
        let { x, y } = this.getMargin();
        width = Math.max(width - x, 0);
        height = Math.max(height - y, 0);
        return {
            width,
            height
        }
    }

    ensureMinimumSize(size) {
        size.width = Math.max(size.width, this._nominal.minWidth === this.sizes.UNSET ? 0 : this._nominal.minWidth);
        size.height = Math.max(size.height, this._nominal.minHeight === this.sizes.UNSET ? 0 : this._nominal.minHeight);
        return size;
    }

    ensureMaximumSize(size) {
        size.width = Math.min(size.width, this._nominal.maxWidth === this.sizes.UNSET ? Number.MAX_SAFE_INTEGER : this._nominal.maxWidth);
        size.height = Math.min(size.height, this._nominal.maxHeight === this.sizes.UNSET ? Number.MAX_SAFE_INTEGER : this._nominal.maxHeight);
        return size;
    }

    applyMarginSize(size) {
        let { x, y } = this.getMargin();
        size.width -= x;
        size.height -= y;
        return size;
    }

    applyBorderSize(size) {
        let { x, y } = this.getBorder();
        size.width += x;
        size.height += y;
        return size;
    }

    unapplyBorderSize(size) {
        let { x, y } = this.getBorder();
        size.width -= x;
        size.height -= y;
        return size;
    }

    getSize() {
        let size = {};
        if (this._nominal.width === this.sizes.AUTO || this._nominal.height === this.sizes.UNSET) {
            // size not explicitly set
            size.width = this.getViewport().width;
        } else {
            size.width = this._nominal.width;
        }

        if (this._nominal.height === this.sizes.AUTO || this._nominal.height === this.sizes.UNSET) {
            // size not explicitly set
            size.height = this.getViewport().height;
        } else {
            size.height = this._nominal.height;
        }

        size = this.applyMarginSize(size);
        size = this.applyBorderSize(size);
        size = this.ensureMinimumSize(size);
        size = this.ensureMaximumSize(size);
        return size;
    }

    /**
     * Fills the rest of the buffer with the desired string
     * @param {*} str the string to fill the buffer with
     * @param {*} transform  the transform to apply to the string
     */
    fill(str, transform) {
        let { width, height } = this.getSize();
        let requiredHeight = height - this.aBuffer.length;
        let size = width;
        useRealLength();
        if (str) {
            size = Math.ceil(width / str.length);
        } else {
            str = " ";
        }
        for (let i = 0; i < requiredHeight; i++) {
            let fill = str.repeat(size);
            if (fill.realLength() >= width) {
                fill = fill.substring(0, width);
            } else if (fill.realLength() < width) {
                fill = s(fill, width);
            }
            if (typeof transform === 'function') {
                fill = transform(fill);
            }
            this.aBuffer.push(fill);
        }
        useRealLength(false);
    }

    /*
    getMaximumSize() {
        return {
            width: this._nominal.maxWidth,
            height: this._nominal.maxHeight
        }
    }

    getMinimumSize() {
        return {
            width: this._nominal.minWidth,
            height: this._nominal.minHeight
        }
    }

    getSize() {
        return {
            width: this._nominal.width,
            height: this._nominal.height
        }
    }*/

    invokeRender() {
        this.aBuffer = [];
        this.render();
        let { width, height } = this.unapplyBorderSize(this.getSize());
        useRealLength(true);
        this.aBuffer.forEach(line => {
            if (line.realLength() !== width) {
                throw new Error("Renderable buffer dimensions must be equal to control dimensions");
            }
        });
        if (this.aBuffer.length !== height) {
            throw new Error("Renderable buffer dimensions must be equal to control dimensions");
        }
        useRealLength(false);
        return this.aBuffer;
    }

    render() {

    }
}