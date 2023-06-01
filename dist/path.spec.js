"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const os_1 = require("os");
const path_1 = require("./path");
const path = require("path");
describe('normalizeTilde function', () => {
    it('substitutes the tilde (~) symbol with the home directory', () => {
        const dirName = path.join('~', 'aDirPath', 'aSubDirPath');
        const expectedNormalizedPath = `${(0, os_1.homedir)()}/aDirPath/aSubDirPath`;
        const normalizedPath = (0, path_1.normalizeTilde)(dirName);
        (0, chai_1.expect)(normalizedPath).equal(expectedNormalizedPath);
    });
    it('substitutes the tilde (~) symbol with the home directory - works also with a trailing slash', () => {
        const dirName = path.join('~', 'aDirPath', 'aSubDirPath', '/');
        const expectedNormalizedPath = `${(0, os_1.homedir)()}/aDirPath/aSubDirPath/`;
        const normalizedPath = (0, path_1.normalizeTilde)(dirName);
        (0, chai_1.expect)(normalizedPath).equal(expectedNormalizedPath);
    });
    it('if there is no tilde (~) symbol the same path is returned', () => {
        const dirName = 'aDirPath/aSubDirPath/';
        const normalizedPath = (0, path_1.normalizeTilde)(dirName);
        (0, chai_1.expect)(normalizedPath).equal(dirName);
    });
});
//# sourceMappingURL=path.spec.js.map