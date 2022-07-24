export default class MenuifyError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}