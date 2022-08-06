export function s(str, wid) {
    let length = str.realLength();
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