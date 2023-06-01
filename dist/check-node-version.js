"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForMinimalNodeVersion = void 0;
function checkForMinimalNodeVersion(minVersion) {
    const nodeVersion = process.version;
    const nodeVersionInt = versionToInt(nodeVersion);
    const minVersionInt = versionToInt(minVersion);
    if (nodeVersionInt < minVersionInt) {
        throw new Error(`The node version ${nodeVersion} is not supported. Minimal supported version is ${minVersion}`);
    }
}
exports.checkForMinimalNodeVersion = checkForMinimalNodeVersion;
function versionToInt(version) {
    const versionParts = version.split('.');
    if (versionParts.length !== 3) {
        throw new Error(`The version ${version} is not in the form 'vXX.YY.ZZ'`);
    }
    let versionMajor = versionParts[0];
    if (versionMajor[0] !== 'v') {
        throw new Error(`The current node major version ${version} does not start with 'v'`);
    }
    versionMajor = versionMajor.substring(1);
    return parseInt(versionMajor) * 10000 + parseInt(versionParts[1]) * 100 + parseInt(versionParts[2]);
}
//# sourceMappingURL=check-node-version.js.map