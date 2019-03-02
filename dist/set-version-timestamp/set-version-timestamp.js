// import {readLinesObs, writeFileObs} from '../observable-fs';
// import { map, switchMap } from 'rxjs/operators';
// const versionLine = 'version: "1.0.1",';
// const timestampLine = 'timestampbuild: "00-11-22",';
// const linesToAdd = [
//     versionLine,
//     timestampLine
// ];
// export function setVersionTimestampObs() {
//     return readLinesObs(__dirname + '/environment.prod.ts')
//     .pipe(
//         map(lines => {
//             const startDefinitionLine = lines.find(line => line.includes('export const environment = {'));
//             const startDefinitionIndex = lines.indexOf(startDefinitionLine);
//             console.log('startDefinitionIndex', startDefinitionIndex);
//             const newLines = [...lines];
//             newLines.splice(startDefinitionIndex + 1, 0, ...linesToAdd );
//             return newLines;
//         }),
//         switchMap(lines => writeFileObs(__dirname + '/environment.prod.ts', lines))
//     )
// }
// export function setVersionTimestamp() {
//     setVersionTimestampObs()
//     .subscribe(
//         file => console.log('version and timestamp added to file: ', file),
//         console.error
//     );
// }
//# sourceMappingURL=set-version-timestamp.js.map