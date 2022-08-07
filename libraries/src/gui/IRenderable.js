import { s, useRealLength, useContext, __EXPERIMENTAL__cutEnd } from "./saffronUtils.js";
import chalk from "chalk";

export default class IRenderable {

    // Constructor
    constructor(name) {
        /*
        if (viewport) {
            this._nominal.viewportWidth = viewport.width ?? this.sizes.UNSET;
            this._nominal.viewportHeight = viewport.height ?? this.sizes.UNSET;
        }*/
        if (name) {
            this.name = name;
        } else {
            throw new Error('Name is required for all renderables');
        }
    }

    // Default sizes
    margins = { NONE: 0 };

    paddings = { NONE: 0 };

    paddingTypes = {
        RELATIVE_TO_ELEMENT: 0,
        RELATIVE_TO_VIEWPORT: 1,
    }

    sizes = {
        AUTO: 'auto',
        UNSET: null
    }

    borders = {
        NONE: 0,
        SOLID: 1,
        SOLID_THICK: 2,
        ROUNDED: 4,
        ROUNDED_THICK: 8,
        DOUBLE: 16,
        DASHED: 32,
        DOTTED: 64,
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

    styles = {
        railColor: [45, 55, 80],
        headColor: [80, 100, 120],
        borderBlur: [100, 110, 140],
        borderFocus: [255, 255, 255]
    }

    // Getters and setters
    _nominal = {
        margin: {
            top: this.margins.NONE,
            right: this.margins.NONE,
            bottom: this.margins.NONE,
            left: this.margins.NONE,
            ratio: [1, 1]
        },

        padding: {
            top: this.paddings.NONE,
            right: this.paddings.NONE,
            bottom: this.paddings.NONE,
            left: this.paddings.NONE,
            ratio: [3, 1],
            type: this.paddingTypes.RELATIVE_TO_ELEMENT
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

        scrollX: 0,
        scrollY: 0,
        scrollbar: false,

        focus: false,

        transform: (arg) => { return arg; }, // blank transform function
    }

    _native = {
        getBorderCharacter: (type, orientation) => {
            switch (orientation) {
                case this.border_orientations.TOP:
                case this.border_orientations.BOTTOM:
                    switch (type) {
                        case this.borders.SOLID:
                            return '─';
                        case this.borders.SOLID_THICK:
                            return '━';
                        case this.borders.ROUNDED:
                            return '─';
                        case this.borders.ROUNDED_THICK:
                            return '━';
                        case this.borders.DOUBLE:
                            return '═';
                        case this.borders.DASHED:
                            return '╸';
                        case this.borders.DOTTED:
                            return '⁃';
                        case this.borders.NONE:
                        default:
                            return '';
                    }

                case this.border_orientations.LEFT:
                case this.border_orientations.RIGHT:
                    switch (type) {
                        case this.borders.SOLID:
                            return '│';
                        case this.borders.SOLID_THICK:
                            return '┃';
                        case this.borders.ROUNDED:
                            return '│';
                        case this.borders.ROUNDED_THICK:
                            return '┃';
                        case this.borders.DOUBLE:
                            return '║';
                        case this.borders.DASHED:
                            return '╻'
                        case this.borders.DOTTED:
                            return '╎';
                        case this.borders.NONE:
                        default:
                            return '';
                    }
                case this.border_orientations.TOP_LEFT:
                    switch (type) {
                        case this.borders.SOLID:
                            return '┌';
                        case this.borders.SOLID_THICK:
                            return '┏';
                        case this.borders.ROUNDED:
                            return '╭';
                        case this.borders.ROUNDED_THICK:
                            return '╭';
                        case this.borders.DOUBLE:
                            return '╔';
                        case this.borders.DASHED:
                            return '╻'
                        case this.borders.DOTTED:
                            return '┌';
                        case this.borders.NONE:
                        default:
                            return '';
                    }
                case this.border_orientations.TOP_RIGHT:
                    switch (type) {
                        case this.borders.SOLID:
                            return '┐';
                        case this.borders.SOLID_THICK:
                            return '┓';
                        case this.borders.ROUNDED:
                            return '╮';
                        case this.borders.ROUNDED_THICK:
                            return '╮';
                        case this.borders.DOUBLE:
                            return '╗';
                        case this.borders.DASHED:
                            return '╻'
                        case this.borders.DOTTED:
                            return '┐';
                        case this.borders.NONE:
                        default:
                            return '';
                    }
                case this.border_orientations.BOTTOM_LEFT:
                    switch (type) {
                        case this.borders.SOLID:
                            return '└';
                        case this.borders.SOLID_THICK:
                            return '┗';
                        case this.borders.ROUNDED:
                            return '╰';
                        case this.borders.ROUNDED_THICK:
                            return '╰';
                        case this.borders.DOUBLE:
                            return '╚';
                        case this.borders.DASHED:
                            return ' '
                        case this.borders.DOTTED:
                            return '└';
                        case this.borders.NONE:
                        default:
                            return '';
                    }
                case this.border_orientations.BOTTOM_RIGHT:
                    switch (type) {
                        case this.borders.SOLID:
                            return '┘';
                        case this.borders.SOLID_THICK:
                            return '┛';
                        case this.borders.ROUNDED:
                            return '╯';
                        case this.borders.ROUNDED_THICK:
                            return '╯';
                        case this.borders.DOUBLE:
                            return '╝';
                        case this.borders.DASHED:
                            return '╸'
                        case this.borders.DOTTED:
                            return '┘';
                        case this.borders.NONE:
                        default:
                            return '';
                    }
            }
        }
    }

    _debug = {
        _enabled: false,
        enable: () => { this._debug._enabled = true; },
        disable: () => { this._debug._enabled = false; },
        getTitleBarInfo: (delim) => {
            let { width, height } = this.getSize();
            let viewport = this.getViewport(false);
            if (this._debug._enabled) {
                let fill = width - 1;
                let debugText = "";

                useRealLength();
                //debugText = `${width}x${height}`;
                let perecedence = [
                    { text: `${width}x${height}`, prepend: false },
                    { text: `${viewport.width}x${viewport.height}`, prepend: false },
                    { text: `${this._nominal.scrollX}x${this._nominal.scrollY}`, prepend: false },
                    { text: this.name, prepend: true },
                ];

                let tempText = [];
                let tempFill = fill;
                for (let i = 0; i < perecedence.length; i++) {
                    let { text, prepend } = perecedence[i];
                    //let spacer = Math.min(tempText.length, 1);
                    tempFill = i === 0 ? tempFill - 1 : tempFill;
                    if (tempFill - 1 > text.realLength()) {
                        tempFill -= text.realLength() + 1;
                        if (prepend) {
                            tempText.unshift(text);
                        } else {
                            tempText.push(text);
                        }
                    } else {
                        break;
                    }
                }
                debugText = chalk.bgRgb(0, 230, 140).black(" " + tempText.join(delim ?? "|") + " ");
                fill = tempFill;

                useRealLength(false);

                return {
                    debugText,
                    borderWidth: fill
                }
            } else {
                return {
                    debugText: "",
                    borderWidth: width - 1,
                }
            }
        }
    }

    normalizePercents(value, axis, includeMargins) {
        if (typeof value === 'string') {
            if (value.endsWith('%')) {
                let { width, height } = this.getViewport(includeMargins);
                switch (axis) {
                    case 'width':
                        return Math.floor((Math.max(Math.min(parseInt(value), 100), 0) / 100) * width);
                    case 'height':
                        return Math.floor((Math.max(Math.min(parseInt(value), 100), 0) / 100) * height);
                    default:
                        return value;
                }
            } else {
                return value;
            }
        } else if (typeof value === 'number') {
            return value;
        }
    }

    focus() {
        this._nominal.focus = true;
    }

    blur() {
        this._nominal.focus = false;
    }

    hasFocus() {
        return this._nominal.focus;
    }

    applyMarginRatio(margin) {
        margin.top *= this._nominal.margin.ratio[1];
        margin.right *= this._nominal.margin.ratio[0];
        margin.bottom *= this._nominal.margin.ratio[1];
        margin.left *= this._nominal.margin.ratio[0];
        return margin;
    }

    applyPaddingRatio(padding) {
        padding.top *= this._nominal.padding.ratio[1];
        padding.right *= this._nominal.padding.ratio[0];
        padding.bottom *= this._nominal.padding.ratio[1];
        padding.left *= this._nominal.padding.ratio[0];
        return padding;
    }

    // Margin
    getMargin() {
        let margin = {
            top: this.normalizePercents(this._nominal.margin.top, 'height', false),
            right: this.normalizePercents(this._nominal.margin.right, 'width', false),
            bottom: this.normalizePercents(this._nominal.margin.bottom, 'height', false),
            left: this.normalizePercents(this._nominal.margin.left, 'width', false)
        }
        margin = this.applyMarginRatio(margin);
        margin.x = margin.left + margin.right;
        margin.y = margin.top + margin.bottom;
        return margin;
    }

    // Border
    getBorder() {
        return {
            top: this._nominal.border.top,
            right: this._nominal.border.right,
            bottom: this._nominal.border.bottom,
            left: this._nominal.border.left,
            x: (this._nominal.border.left !== this.borders.NONE ? 1 : 0) +
                (this._nominal.border.right !== this.borders.NONE ? 1 : 0),
            y: (this._nominal.border.top !== this.borders.NONE ? 1 : 0) +
                (this._nominal.border.bottom !== this.borders.NONE ? 1 : 0)
        }
    }

    getPadding() {
        let includeMargins = this._nominal.padding.type === this.paddingTypes.RELATIVE_TO_VIEWPORT ? false : true;
        let padding = {
            top: this.normalizePercents(this._nominal.padding.top, 'height', includeMargins),
            right: this.normalizePercents(this._nominal.padding.right, 'width', includeMargins),
            bottom: this.normalizePercents(this._nominal.padding.bottom, 'height', includeMargins),
            left: this.normalizePercents(this._nominal.padding.left, 'width', includeMargins)
        };
        padding = this.applyPaddingRatio(padding);
        padding.x = padding.left + padding.right;
        padding.y = padding.top + padding.bottom;
        return padding;
    }

    borderLeft(type) { this._nominal.border.left = type; }
    borderRight(type) { this._nominal.border.right = type; }
    borderTop(type) { this._nominal.border.top = type; }
    borderBottom(type) { this._nominal.border.bottom = type; }
    border(top, right, bottom, left) {
        if ((top !== undefined || top !== null) &&
            (right !== undefined || right !== null) &&
            (bottom !== undefined || bottom !== null) &&
            (left !== undefined || left !== null)) {
            this.borderTop(top);
            this.borderRight(right);
            this.borderBottom(bottom);
            this.borderLeft(left);
        } else {
            throw new Error('Top, right, bottom and left margins must be defined');
        }
    }
    uniformBorder(type) {
        this.borderLeft(type);
        this.borderRight(type);
        this.borderTop(type);
        this.borderBottom(type);
    }
    borderXY(x, y) {
        if ((x !== undefined || x !== null) && (y !== undefined || y !== null)) {
            this.borderTop(y);
            this.borderRight(x);
            this.borderBottom(y);
            this.borderLeft(x);
        } else {
            throw new Error('X and Y dimensions must be defined');
        }
    }

    marginLeft(margin) { this._nominal.margin.left = margin; }
    marginRight(margin) { this._nominal.margin.right = margin; }
    marginTop(margin) { this._nominal.margin.top = margin; }
    marginBottom(margin) { this._nominal.margin.bottom = margin; }
    margin(top, right, bottom, left) {
        if ((top !== undefined || top !== null) &&
            (right !== undefined || right !== null) &&
            (bottom !== undefined || bottom !== null) &&
            (left !== undefined || left !== null)) {
            this.marginTop(top);
            this.marginRight(right);
            this.marginBottom(bottom);
            this.marginLeft(left);
        } else {
            throw new Error('Top, right, bottom and left margins must be defined');
        }
    }
    uniformMargin(margin) {
        this.marginTop(margin);
        this.marginRight(margin);
        this.marginBottom(margin);
        this.marginLeft(margin);
    }
    marginXY(x, y) {
        if ((x !== undefined || x !== null) && (y !== undefined || y !== null)) {
            this.marginTop(y);
            this.marginRight(x);
            this.marginBottom(y);
            this.marginLeft(x);
        } else {
            throw new Error('X and Y dimensions must be defined');
        }
    }

    setMarginRatio(ratioX, ratioY) {
        this._nominal.margin.ratio = [ratioX, ratioY];
    }
    getMarginRatio(ratioX, ratioY) {
        return {
            x: this._nominal.margin.ratio[0],
            y: this._nominal.margin.ratio[1]
        }
    }

    paddingLeft(padding) { this._nominal.padding.left = padding; }
    paddingRight(padding) { this._nominal.padding.right = padding; }
    paddingTop(padding) { this._nominal.padding.top = padding; }
    paddingBottom(padding) { this._nominal.padding.bottom = padding; }
    padding(top, right, bottom, left) {
        if ((top !== undefined || top !== null) &&
            (right !== undefined || right !== null) &&
            (bottom !== undefined || bottom !== null) &&
            (left !== undefined || left !== null)) {
            this.paddingTop(top);
            this.paddingRight(right);
            this.paddingBottom(bottom);
            this.paddingLeft(left);
        } else {
            throw new Error('Top, right, bottom and left dimensions must be defined');
        }
    }
    uniformPadding(padding) {
        this.paddingTop(padding);
        this.paddingRight(padding);
        this.paddingBottom(padding);
        this.paddingLeft(padding);
    }
    paddingXY(x, y) {
        if ((x !== undefined || x !== null) && (y !== undefined || y !== null)) {
            this.paddingTop(y);
            this.paddingRight(x);
            this.paddingBottom(y);
            this.paddingLeft(x);
        } else {
            throw new Error('X and Y dimensions must be defined');
        }
    }

    setPaddingRatio(ratioX, ratioY) {
        this._nominal.padding.ratio = [ratioX, ratioY];
    }
    getPaddingRatio(ratioX, ratioY) {
        return {
            x: this._nominal.padding.ratio[0],
            y: this._nominal.padding.ratio[1]
        }
    }

    // Automatically fills the viewport requirements from the process.stdout size
    useConsoleViewport() {
        this._nominal.viewportWidth = process.stdout.columns;
        this._nominal.viewportHeight = process.stdout.rows;
    }

    useTransform(transform) {
        this._nominal.transform = transform;
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
    getViewport(withMargins = true) {
        let width = this._nominal.viewportWidth === this.sizes.UNSET ? process.stdout.columns : this._nominal.viewportWidth;
        let height = this._nominal.viewportHeight === this.sizes.UNSET ? process.stdout.rows : this._nominal.viewportHeight;
        if (withMargins) {
            let { x, y } = this.getMargin();
            width = Math.max(width - x, 0);
            height = Math.max(height - y, 0);
        }
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

    _calculateRealWidth() {
        useRealLength();
        let wid = (this.lastBuffer ?? this.aBuffer).reduce((real, line) => Math.max(real, (line && line.realLength()) ?? 0), 0);
        useRealLength(false);
        return wid;
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

    // Applies the padding dimensions to the size
    applyPaddingSize(size) {
        let { x, y } = this.getPadding();
        size.width -= x;
        size.height -= y;
        return size;
    }

    postprocess() {
        this.applyTransform();
        this.preapplyScrollbar();
        this.applyPadding();
        this.applyScrollbar();
        this.applyBorder();
        this.applyMargin();
    }

    applyTransform() {
        if (typeof this._nominal.transform === 'function') {
            this.aBuffer = this.aBuffer.map((line) => { return this._nominal.transform(line) });
        }
    }

    preapplyScrollbar() {
        if (this._nominal.scrollbar) {
            if (this._nominal.padding.right === this.paddings.NONE) {
                // If there is no padding on the right, delete the last column of the buffer
                this.aBuffer = this.aBuffer.map((line) => { return __EXPERIMENTAL__cutEnd(line, 1) });
            }
        }
    }

    applyPadding() {
        let { top, right, bottom, left } = this.getPadding();
        let { width } = this.getSize();

        if (this._nominal.scrollbar) right = Math.max(right - 1, 0);

        if (left !== this.paddings.NONE) {
            this.aBuffer = this.aBuffer.map(x => " ".repeat(left) + x);
        }
        if (right !== this.paddings.NONE) {
            this.aBuffer = this.aBuffer.map(x => x + " ".repeat(right));
        }
        if (top !== this.paddings.NONE) {
            for (let i = 0; i < top; i++) {
                this.aBuffer.unshift(" ".repeat(width + left + right));
            }
        }
        if (bottom !== this.paddings.NONE) {
            for (let i = 0; i < bottom; i++) {
                this.aBuffer.push(" ".repeat(width + left + right));
            }
        }
    }

    applyScrollbar() {
        if (this._nominal.scrollbar) {
            let { height } = this.getSize();
            let contentHeight = this.lastBuffer.length;
            let ratio = height / contentHeight;
            let headHeight = Math.ceil(ratio * height);
            let headTop = Math.ceil(ratio * this._nominal.scrollX);
            let vBuffer = [];
            for (let i = 0; i < height; i++) {
                if (i < headTop || i >= headTop + headHeight - 1) {
                    vBuffer.push(chalk.bgRgb(...this.styles.railColor)(" "));
                } else {
                    vBuffer.push(chalk.bgRgb(...this.styles.headColor)(" "));
                }
            }
            this.aBuffer = this.aBuffer.map((line, i) => { return line + vBuffer[i] });
        }
    }

    applyBorder() {
        let { top, right, bottom, left } = this.getBorder();
        let { width } = this.unapplyPaddingSize(this.getSize());
        let hasFocus = this.hasFocus();
        let borderTopLeft = this._native.getBorderCharacter(top, this.border_orientations.TOP_LEFT);
        let borderTop = this._native.getBorderCharacter(top, this.border_orientations.TOP);
        let borderTopRight = this._native.getBorderCharacter(top, this.border_orientations.TOP_RIGHT);
        let borderRight = this._native.getBorderCharacter(right, this.border_orientations.RIGHT);
        let borderLeft = this._native.getBorderCharacter(left, this.border_orientations.LEFT);
        let borderBottomLeft = this._native.getBorderCharacter(bottom, this.border_orientations.BOTTOM_LEFT);
        let borderBottom = this._native.getBorderCharacter(bottom, this.border_orientations.BOTTOM);
        let borderBottomRight = this._native.getBorderCharacter(bottom, this.border_orientations.BOTTOM_RIGHT);

        borderTopLeft = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderTopLeft) : chalk.rgb(...this.styles.borderBlur)(borderTopLeft);
        borderTop = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderTop) : chalk.rgb(...this.styles.borderBlur)(borderTop);
        borderTopRight = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderTopRight) : chalk.rgb(...this.styles.borderBlur)(borderTopRight);
        borderRight = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderRight) : chalk.rgb(...this.styles.borderBlur)(borderRight);
        borderLeft = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderLeft) : chalk.rgb(...this.styles.borderBlur)(borderLeft);
        borderBottomLeft = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderBottomLeft) : chalk.rgb(...this.styles.borderBlur)(borderBottomLeft);
        borderBottom = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderBottom) : chalk.rgb(...this.styles.borderBlur)(borderBottom);
        borderBottomRight = hasFocus ? chalk.rgb(...this.styles.borderFocus)(borderBottomRight) : chalk.rgb(...this.styles.borderBlur)(borderBottomRight);


        if (left !== this.borders.NONE) {
            this.aBuffer = this.aBuffer.map(x => borderLeft + x);
        }
        if (right !== this.borders.NONE) {
            this.aBuffer = this.aBuffer.map(x => x + borderRight);
        }
        if (top !== this.borders.NONE) {
            let { debugText, borderWidth } = this._debug.getTitleBarInfo();

            this.aBuffer.unshift(borderTopLeft + (new Array(borderWidth).fill(borderTop)).join("") + debugText + borderTop + borderTopRight);
        }
        if (bottom !== this.borders.NONE) {
            this.aBuffer.push(borderBottomLeft + (new Array(width).fill(borderBottom)).join("") + borderBottomRight);
        }
    }

    applyMargin() {
        let { top, right, bottom, left } = this.getMargin();
        let { width, height } = this.unapplyBorderSize(this.unapplyPaddingSize(this.getSize()));

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

    // Unapplies the padding dimensions to the size
    unapplyPaddingSize(size) {
        let { x, y } = this.getPadding();
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
        size = this.applyPaddingSize(size);
        size = this.ensureMinimumSize(size);
        size = this.ensureMaximumSize(size);
        return size;
    }

    /**
     * Fills the rest of the buffer with the desired string
     * @param {*} str the string to fill the buffer with
     * @param {*} transform  the transform to apply to the string
     */
    fill(str, transform, passArguments) {
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
                if (passArguments) {
                    fill = transform(fill, {
                        width,
                        height,
                        fillWidth: size,
                        fillHeight: requiredHeight,
                        index: i
                    });
                } else {
                    fill = transform(fill);
                }
            }
            this.aBuffer.push(fill);
        }
        useRealLength(false);
    }

    fillOnce(str, transform) {
        let { width } = this.getSize();
        let out = null;
        useRealLength();
        if (str.realLength() < width) {
            out = s(str, this.getSize().width);
        } else if (str.realLength() >= width) {
            out = __EXPERIMENTAL__cutEnd(str, Math.max(str.realLength() - width, 0));
        }
        useRealLength(false);

        if (typeof transform === 'function') {
            out = transform(out);
        }
        this.aBuffer.push(out);
    }

    invokeRender() {
        this.aBuffer = [];
        this.render();
        this.lastBuffer = this.aBuffer;

        let { width, height } = this.getSize();
        useRealLength(true);

        this.aBuffer.forEach(line => {
            if (line === null || line === undefined || line.realLength() !== width) {
                throw new Error("Renderable buffer dimensions must be equal to control dimensions");
            }
        });

        if (this.aBuffer.length < height) {
            this.fill();
        } else if (this.aBuffer.length > height) {
            // trim the buffer, but also enable scrolling
            this._nominal.scrollbar = true;
            this.aBuffer = this.aBuffer.slice(this._nominal.scrollX, this._nominal.scrollX + height);
        }

        useRealLength(false);

        this.postprocess();

        return this.aBuffer;
    }

    onResize = null;

    render() {

    }

    show() {
        let renderBuffer = this.invokeRender();
        process.stdout.write(renderBuffer.join("\n"));
    }

    scrollDown() {
        this._nominal.scrollX = Math.min(this.lastBuffer.length - this.getSize().height, this._nominal.scrollX + 1);
    }

    scrollUp() {
        this._nominal.scrollX = Math.max(0, this._nominal.scrollX - 1);
    }

    streamConsoleViewportAsync = async (getViewport, cancelCallback) => {
        const { readkey, consolekeys, cursor } = useContext();

        let loop = true;

        let cancel = () => {
            loop = false;
        }
        if (cancelCallback) cancelCallback(cancel);

        while (loop) {
            if (getViewport === undefined || getViewport === null) {
                console.clear();
                cursor.hide();
                this.useConsoleViewport();
            } else {
                this.setViewport(getViewport());
            }

            this.focus();
            this.show();
            let key = await readkey(true);
            switch (key) {
                case consolekeys.sigint:
                    loop = false;
                    break;
                case consolekeys.resize:
                    if (this.onResize) {
                        this.onResize();
                    }
                    break;
                case consolekeys.up:
                    this.scrollUp();
                    break;
                case consolekeys.down:
                    this.scrollDown();
                    break;
            }
        }
        cursor.show();
    }
}