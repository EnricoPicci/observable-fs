import 'mocha';
import { expect } from 'chai';
import { homedir } from 'os';
import { normalizeTilde } from './path';
import path = require('path');

describe('normalizeTilde function', () => {
    it('substitutes the tilde (~) symbol with the home directory', () => {
        const dirName = path.join('~', 'aDirPath', 'aSubDirPath');
        const expectedNormalizedPath = `${homedir()}/aDirPath/aSubDirPath`;

        const normalizedPath = normalizeTilde(dirName);
        expect(normalizedPath).equal(expectedNormalizedPath);
    });
    it('substitutes the tilde (~) symbol with the home directory - works also with a trailing slash', () => {
        const dirName = path.join('~', 'aDirPath', 'aSubDirPath', '/');
        const expectedNormalizedPath = `${homedir()}/aDirPath/aSubDirPath/`;

        const normalizedPath = normalizeTilde(dirName);
        expect(normalizedPath).equal(expectedNormalizedPath);
    });
    it('if there is no tilde (~) symbol the same path is returned', () => {
        const dirName = 'aDirPath/aSubDirPath/';

        const normalizedPath = normalizeTilde(dirName);
        expect(normalizedPath).equal(dirName);
    });
});
