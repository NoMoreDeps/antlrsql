"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const antlr4ts_1 = require("antlr4ts");
class CaseInsensitiveInputStream {
    constructor(...args) {
        const inputStream = args[0];
        const upperCase = args[1] === true ? true : false;
        this._stream = typeof (inputStream) === "string"
            ?
                new antlr4ts_1.ANTLRInputStream(inputStream)
            :
                inputStream;
        this._case = upperCase;
    }
    get name() {
        return this._stream.name;
    }
    set name(value) {
        this._stream.name = value;
    }
    reset() {
        this._stream.reset();
    }
    consume() {
        this._stream.consume();
    }
    LA(offset) {
        let c = this._stream.LA(offset);
        if (c <= 0) {
            return c;
        }
        return String.fromCharCode(c)[this._case ? "toUpperCase" : "toLowerCase"]().codePointAt(0);
    }
    LT(offset) {
        return this._stream.LT(offset);
    }
    get index() {
        return this._stream.index;
    }
    get size() {
        return this._stream.size;
    }
    mark() {
        return this._stream.mark();
    }
    release(marker) {
        this._stream.release(marker);
    }
    getText(interval) {
        return this._stream.getText(interval);
    }
    ;
    seek(index) {
        this._stream.seek(index);
    }
    get sourceName() {
        return this._stream.sourceName;
    }
    toString() {
        return this._stream.toString();
    }
}
exports.CaseInsensitiveInputStream = CaseInsensitiveInputStream;
//# sourceMappingURL=CaseInsensitiveInputStream.js.map