import { s, useRealLength } from "./saffronUtils.js";

export default class IRenderable {

    // Constructor
    constructor(viewport) {
        if (viewport) {
            this._nominal.viewportWidth = viewport.width ?? this.sizes.UNSET;
            this._nominal.viewportHeight = viewport.height ?? this.sizes.UNSET;
        }
    }

    // Default sizes
    margins = {
        AUTO: 'auto',
        NONE: 0
    };

    sizes = {
        AUTO: 'auto',
        UNSET: null
    }

    borders = {
        NONE: 0,
        SOLID: 1,
        DASHED: 2,
        DOTTED: 3,
    }

    border_orientations = {
        TOP_LEFT: 0,
        TOP: 1,
        TOP_RIGHT: 2,
        LEFT: 3,
        RIGHT: 4,
        BOTTOM_LEFT: 5,
        BOTTOM: 6,
        BOTTOM_RIGHT: 7
    }

    // Getters and setters
    _nominal = {
        margin: {
            top: this.margins.NONE,
            right: this.margins.NONE,
            bottom: this.margins.NONE,
            left: this.margins.NONE
        },

        border: {
            top: this.borders.NONE,
            right: this.borders.NONE,
            bottom: this.borders.NONE,
            left: this.borders.NONE
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

    _native = {
        getBorderCharacter: (type, orientation) => {
            switch (orientation) {
                case this.border_orientations.TOP:
                case this.border_orientations.BOTTOM:
                    switch (type) {
                        case this.borders.SOLID:
                            return '─';
                        case this.borders.DASHED:
                            return '─';
                        case this.borders.DOTTED:
                            return '.';
                        case this.borders.NONE:
                        default:
                            return '';
                    }

                case this.border_orientations.LEFT:
                case this.border_orientations.RIGHT:
                    switch (type) {
                        case this.borders.SOLID:
                            return '|';
                        case this.borders.DASHED:
                            return '|';
                        case this.borders.DOTTED:
                            return ':';
                        case this.borders.NONE:
                        default:
                            return '';
                    }
                case this.border_orientations.TOP_LEFT:
                    return '┌';
                case this.border_orientations.TOP_RIGHT:
                    return '┐';
                case this.border_orientations.BOTTOM_LEFT:
                    return '└';
                case this.border_orientations.BOTTOM_RIGHT:
                    return '┘';
            }
        }
    }

    // Margin
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

    // Border
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

    borderLeft(type) { this._nominal.border.left = type; }
    borderRight(type) { this._nominal.border.right = type; }
    borderTop(type) { this._nominal.border.top = type; }
    borderBottom(type) { this._nominal.border.bottom = type; }
    border(top, right, bottom, left) {
        this.borderTop(top);
        this.borderRight(right);
        this.borderBottom(bottom);
        this.borderLeft(left);
    }
    uniformBorder(type) {
        this.borderLeft(type);
        this.borderRight(type);
        this.borderTop(type);
        this.borderBottom(type);
    }

    marginLeft(margin) { this._nominal.margin.left = margin; }
    marginRight(margin) { this._nominal.margin.right = margin; }
    marginTop(margin) { this._nominal.margin.top = margin; }
    marginBottom(margin) { this._nominal.margin.bottom = margin; }
    margin(top, right, bottom, left) {
        this.marginTop(top);
        this.marginRight(right);
        this.marginBottom(bottom);
        this.marginLeft(left);
    }
    uniformMargin(margin) {
        this.marginTop(margin);
        this.marginRight(margin);
        this.marginBottom(margin);
        this.marginLeft(margin);
    }

    // Automatically fills the viewport requirements from the process.stdout size
    useConsoleViewport() {
        this._nominal.viewportWidth = process.stdout.columns;
        this._nominal.viewportHeight = process.stdout.rows;
    }

    // Manually set the size of the renderable
    setViewport(width, height) {
        if (typeof width === 'object') {
            this._nominal.viewportWidth = width.width;
            this._nominal.viewportHeight = width.height;
        } else {
            this._nominal.viewportWidth = width ?? this.sizes.UNSET;
            this._nominal.viewportHeight = height ?? this.sizes.UNSET;
        }
    }

    // Returns the size of the renderable in pixels
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

    // Ensures the size is at least the minimum size
    ensureMinimumSize(size) {
        size.width = Math.max(size.width, this._nominal.minWidth === this.sizes.UNSET ? 0 : this._nominal.minWidth);
        size.height = Math.max(size.height, this._nominal.minHeight === this.sizes.UNSET ? 0 : this._nominal.minHeight);
        return size;
    }

    // Ensures the size is at most the maximum size
    ensureMaximumSize(size) {
        let { width, height } = this.getViewport();
        size.width = Math.min(size.width, this._nominal.maxWidth === this.sizes.UNSET ? Number.MAX_SAFE_INTEGER : this._nominal.maxWidth);
        size.height = Math.min(size.height, this._nominal.maxHeight === this.sizes.UNSET ? Number.MAX_SAFE_INTEGER : this._nominal.maxHeight);

        size.width = Math.min(size.width, width);
        size.height = Math.min(size.height, height);
        return size;
    }

    // Applies the margin dimensions to the size
    applyMarginSize(size) {
        let { x, y } = this.getMargin();
        size.width -= x;
        size.height -= y;
        return size;
    }

    // Applies the border dimensions to the size
    applyBorderSize(size) {
        let { x, y } = this.getBorder();
        size.width -= x;
        size.height -= y;
        return size;
    }

    postprocess() {
        this.applyBorder();
        this.applyMargin();
    }

    applyBorder() {
        let { top, right, bottom, left } = this.getBorder();
        let { width, height } = this.getSize();
        let borderTopLeft = this._native.getBorderCharacter(top, this.border_orientations.TOP_LEFT);
        let borderTop = this._native.getBorderCharacter(top, this.border_orientations.TOP);
        let borderTopRight = this._native.getBorderCharacter(top, this.border_orientations.TOP_RIGHT);
        let borderRight = this._native.getBorderCharacter(right, this.border_orientations.RIGHT);
        let borderLeft = this._native.getBorderCharacter(left, this.border_orientations.LEFT);
        let borderBottomLeft = this._native.getBorderCharacter(bottom, this.border_orientations.BOTTOM_LEFT);
        let borderBottom = this._native.getBorderCharacter(bottom, this.border_orientations.BOTTOM);
        let borderBottomRight = this._native.getBorderCharacter(bottom, this.border_orientations.BOTTOM_RIGHT);

        if (left !== this.borders.NONE) {
            this.aBuffer = this.aBuffer.map(x => borderLeft + x);
        }
        if (right !== this.borders.NONE) {
            this.aBuffer = this.aBuffer.map(x => x + borderRight);
        }
        if (top !== this.borders.NONE) {
            this.aBuffer.unshift(borderTopLeft + borderTop.repeat(width) + borderTopRight);
        }
        if (bottom !== this.borders.NONE) {
            this.aBuffer.push(borderBottomLeft + borderBottom.repeat(width) + borderBottomRight);
        }
    }

    applyMargin() {
        let { top, right, bottom, left } = this.getMargin();
        let { width, height } = this.unapplyBorderSize(this.getSize());

        if (left !== this.margins.NONE) {
            this.aBuffer = this.aBuffer.map(x => " ".repeat(left) + x);
        }
        if (right !== this.margins.NONE) {
            this.aBuffer = this.aBuffer.map(x => x + " ".repeat(right));
        }
        if (top !== this.margins.NONE) {
            for (let i = 0; i < top; i++) {
                this.aBuffer.unshift(" ".repeat(width + left + right));
            }
        }
        if (bottom !== this.margins.NONE) {
            for (let i = 0; i < bottom; i++) {
                this.aBuffer.push(" ".repeat(width + left + right));
            }
        }
    }



    // Unapplies the margin dimensions to the size
    unapplyMarginSize(size) {
        let { x, y } = this.getMargin();
        size.width += x;
        size.height += y;
        return size;
    }

    // Unapplies the border dimensions to the size
    unapplyBorderSize(size) {
        let { x, y } = this.getBorder();
        size.width += x;
        size.height += y;
        return size;
    }


    // Returns the size of the content area
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

        //size = this.applyMarginSize(size);
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

    invokeRender() {
        this.aBuffer = [];
        this.render();
        let { width, height } = this.getSize();
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

        this.postprocess();

        return this.aBuffer;
    }

    render() {

    }
}