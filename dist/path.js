"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTilde = void 0;
const path_1 = require("path");
const os_1 = require("os");
// substitues the tilde symbol with the home directory since the tilde symbol is not recogninzed by readdir function of node fs package
// https://stackoverflow.com/questions/26204935/node-webkit-fs-readdirsync-does-not-work
function normalizeTilde(_path) {
    if (!_path || !_path.length) {
        return _path;
    }
    const startsWithTilde = _path[0] === '~';
    if (startsWithTilde) {
        return (0, path_1.join)((0, os_1.homedir)(), _path.substring(1));
    }
    return _path;
}
exports.normalizeTilde = normalizeTilde;
//# sourceMappingURL=path.js.map