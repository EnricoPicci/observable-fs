"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_fs_1 = require("../observable-fs");
const operators_1 = require("rxjs/operators");
const versionLine = 'version: "1.0.1",';
const timestampLine = 'timestampbuild: "00-11-22",';
const linesToAdd = [
    versionLine,
    timestampLine
];
function setVersionTimestampObs() {
    return observable_fs_1.readLinesObs(__dirname + '/environment.prod.ts')
        .pipe(operators_1.map(lines => {
        const startDefinitionLine = lines.find(line => line.includes('export const environment = {'));
        const startDefinitionIndex = lines.indexOf(startDefinitionLine);
        console.log('startDefinitionIndex', startDefinitionIndex);
        const newLines = [...lines];
        newLines.splice(startDefinitionIndex + 1, 0, ...linesToAdd);
        return newLines;
    }), operators_1.switchMap(lines => observable_fs_1.writeFileObs(__dirname + '/environment.prod.ts', lines)));
}
exports.setVersionTimestampObs = setVersionTimestampObs;
function setVersionTimestamp() {
    setVersionTimestampObs()
        .subscribe(file => console.log('version and timestamp added to file: ', file), console.error);
}
exports.setVersionTimestamp = setVersionTimestamp;
//# sourceMappingURL=set-version-timestamp.js.map