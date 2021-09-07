"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileObs = exports.appendFileObs = exports.makeDirObs = exports.deleteDirObs = exports.dirNamesListObs = exports.filesObs = exports.fileListObs = exports.writeFileObs = exports.readLineObs = exports.readLinesObs = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const fs = require("fs");
const readline = require("readline");
const mkdirp = require("mkdirp");
const dir = require("node-dir");
const rimraf = require("rimraf");
const fs_1 = require("fs");
// =============================  Read a file line by line and emits when completed =========================================
// returns and Observable which emits an array containing the lines of the file as strings
exports.readLinesObs = (0, rxjs_1.bindCallback)(_readLines);
function _readLines(filePath, callback) {
    const lines = new Array();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });
    rl.on('line', (line) => {
        lines.push(line);
    });
    rl.on('close', () => {
        callback(lines);
    });
}
// =============================  Read a file line by line and emits for each line =========================================
// returns and Observable which emits each line of the file read
const readLineObs = (filePath) => {
    return new rxjs_1.Observable((observer) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });
        rl.on('line', (line) => {
            observer.next(line);
        });
        rl.on('close', () => {
            observer.complete();
        });
    });
};
exports.readLineObs = readLineObs;
// ======================  Writes an array of strings as lines in a file and emits when completed =========================
// Writes a file whose content is represented by an array of strings.
// Each string is a line of the file.
// If the directory is not present, is created
// Returns an Observable which emits the name of the file written when the write operation is completed
// export function writeFileObs(filePath: string, lines: Array<string>) {
//     return _writeFileObs(filePath, lines);
// }
function writeFileObs(filePath, lines) {
    return new rxjs_1.Observable((subscriber) => {
        const lastSlash = filePath.lastIndexOf('/');
        const fileDir = filePath.substr(0, lastSlash + 1);
        mkdirp(fileDir).then(() => {
            const fileContent = lines.join('\n');
            fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                    subscriber.error(err);
                }
                subscriber.next(filePath);
                subscriber.complete();
            });
        }, (err) => {
            subscriber.error(err);
        });
    });
}
exports.writeFileObs = writeFileObs;
// ============  Emits the list of names of the files present in a directory and subdirectories =========
// returns and Observable which emits once with the list of files found in the directory and all its subdirectories
function fileListObs(fromDirPath) {
    return _fileListObs(fromDirPath);
}
exports.fileListObs = fileListObs;
const _fileListObs = (0, rxjs_1.bindNodeCallback)(dir.files);
// ============  Emits each name of the files present in a directory and subdirectories =========
// returns and Observable which emits for each file found in the directory and all its subdirectories
function filesObs(fromDirPath) {
    return fileListObs(fromDirPath).pipe((0, operators_1.switchMap)((files) => (0, rxjs_1.from)(files)));
}
exports.filesObs = filesObs;
// ============  Emits the list of names of directories present in a directory =========
// returns and Observable which emits the list of names of directories found in the directory passed in as input
function dirNamesListObs(fromDirPath) {
    return new rxjs_1.Observable((observer) => {
        (0, fs_1.readdir)(fromDirPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                observer.error(err);
                return;
            }
            const dirs = files.filter((f) => f.isDirectory()).map((d) => d.name);
            observer.next(dirs);
            observer.complete();
        });
    });
}
exports.dirNamesListObs = dirNamesListObs;
// ============  Deletes a directory and subdirectories and emits when completed =========
// returns and Observable which emits null when the directory and all its subdirectories have been deleted or an error otherwise
// export function deleteDirObs(dirPath: string) {
//     return _rimraf(dirPath);
// }
// const _rimraf = Observable.bindCallback(rimraf);
function deleteDirObs(dirPath) {
    return new rxjs_1.Observable((observer) => {
        rimraf(dirPath, (err) => {
            if (err)
                observer.error(err);
            observer.next(dirPath);
            observer.complete();
        });
    });
}
exports.deleteDirObs = deleteDirObs;
// ============  Creates a directory and emits when completed =========
// returns and Observable which emits the name of the directory when the directory has been created or an error otherwise
function makeDirObs(dirPath) {
    return (0, rxjs_1.from)(mkdirp(dirPath));
}
exports.makeDirObs = makeDirObs;
// ============  Appends a line to a file and emits when completed =========
// returns and Observable which emits the line appended when the line has been appended or an error otherwise
function appendFileObs(filePath, line) {
    return _appendFile(filePath, line);
}
exports.appendFileObs = appendFileObs;
function appendFileNode(filePath, line, cb) {
    return fs.appendFile(filePath, line, (err) => {
        cb(err, line);
    });
}
const _appendFile = (0, rxjs_1.bindNodeCallback)(appendFileNode);
// ============  Deletes a file and emits when completed =========
// returns and Observable which emits the name of the file when the line has been deleted or an error otherwise
function deleteFileObs(filePath) {
    return _deleteFile(filePath);
}
exports.deleteFileObs = deleteFileObs;
function deleteFileNode(filePath, cb) {
    return fs.unlink(filePath, (err) => {
        cb(err, filePath);
    });
}
const _deleteFile = (0, rxjs_1.bindNodeCallback)(deleteFileNode);
//# sourceMappingURL=observable-fs.js.map