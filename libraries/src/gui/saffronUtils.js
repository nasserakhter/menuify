import { getContext } from "../context.js";

export function s(str, wid) {
    useRealLength();
    let length = str.realLength();
    useRealLength(false);
    return str + " ".repeat(Math.max(0, wid - length));
}

export function useRealLength(value = true) {
    if (value) {
        String.prototype.realLength = function () {
            return this.replace(/\x1B\[[0-9;]*?m(?:DA)*/g, "").length;
        }
    } else {
        delete String.prototype.realLength;
    }
}

export function __EXPERIMENTAL__cutEnd(str, length) {
    let parts = str.split(/(?=\x1b[a-zA-Z0-9\[\];]*m)/g);
    let requiredLength = length;
    let processedParts = [];
    for (let i = parts.length - 1; i >= 0; i--) {
        if (requiredLength > 0) {
            let part = parts[i];
            let allowedLength = 0;
            if (part.startsWith("\x1b")) {
                let notallowedLength = part.match(/\x1b[a-zA-Z0-9\[\];]*m/g)[0].length;
                allowedLength = part.length - notallowedLength;
            } else {
                allowedLength = part.length;
            }
            if (allowedLength > 0) {
                // allowedLength is the length of the part that is allowed to be cut
                if (allowedLength > requiredLength) {
                    processedParts.unshift(part.substring(0, part.length - requiredLength));
                    requiredLength = 0;
                } else {
                    processedParts.unshift(part.substring(0, part.length - allowedLength));
                    requiredLength -= allowedLength;
                }
            } else {
                // string is only escapes, so just add it
                processedParts.unshift(part);
            }
        } else {
            processedParts.unshift(parts[i]);
        }
    }
    return processedParts.join("");
}

export let useContext = getContext;