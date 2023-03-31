/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Observable, bindCallback, bindNodeCallback, from, Subscriber, concatMap } from 'rxjs';
import { Observer } from 'rxjs';
import { TeardownLogic } from 'rxjs';

import * as fs from 'fs';
import * as readline from 'readline';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import { readdir, readdirSync } from 'fs';
import { join } from 'path';
import { normalizeTilde } from './path';

// =============================  Read a file line by line and emits when completed =========================================
// returns and Observable which emits an array containing the lines of the file as strings
export const readLinesObs = bindCallback(_readLines);
function _readLines(filePath: string, callback: (lines: Array<string>) => void) {
    filePath = normalizeTilde(filePath);
    const lines = new Array<string>();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });
    rl.on('line', (line: string) => {
        lines.push(line);
    });
    rl.on('close', () => {
        callback(lines);
    });
}

// =============================  Read a file line by line and emits for each line =========================================
// returns and Observable which emits each line of the file read
export const readLineObs = (filePath: string): Observable<string> => {
    filePath = normalizeTilde(filePath);
    return new Observable((observer: Observer<string>): TeardownLogic => {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity,
        });

        rl.on('line', (line: string) => {
            observer.next(line);
        });
        rl.on('close', () => {
            observer.complete();
        });
    });
};

// ======================  Writes an array of strings as lines in a file and emits when completed =========================
// Writes a file whose content is represented by an array of strings.
// Each string is a line of the file.
// If the directory is not present, is created
// Returns an Observable which emits the name of the file written when the write operation is completed
// export function writeFileObs(filePath: string, lines: Array<string>) {
//     return _writeFileObs(filePath, lines);
// }
export function writeFileObs(filePath: string, lines: Array<string>) {
    filePath = normalizeTilde(filePath);
    return new Observable((subscriber: Subscriber<string>): TeardownLogic => {
        const lastSlash = filePath.lastIndexOf('/');
        const fileDir = filePath.substring(0, lastSlash + 1);
        mkdirp(fileDir).then(
            () => {
                const fileContent = lines.join('\n');
                fs.writeFile(filePath, fileContent, (err) => {
                    if (err) {
                        subscriber.error(err);
                    }
                    subscriber.next(filePath);
                    subscriber.complete();
                });
            },
            (err) => {
                subscriber.error(err);
            },
        );
    });
}

// ============  Emits the list of names of the files present in a directory and subdirectories =========
// returns an Observable that noticies the list of files found in the directory and all its subdirectories
export function fileListObs(fromDirPath: string): Observable<readonly string[]> {
    fromDirPath = normalizeTilde(fromDirPath);
    return new Observable((observer: Observer<string[]>): TeardownLogic => {
        const files = _readdirRecursiveSync(fromDirPath);
        observer.next(files);
        observer.complete();
    });
}
function _readdirRecursiveSync(dir: string) {
    const dirs = readdirSync(dir, { withFileTypes: true });
    const files = dirs.reduce((acc: string[], file) => {
        const filePath = join(dir, file.name);
        return acc.concat(file.isDirectory() ? _readdirRecursiveSync(filePath) : filePath);
    }, []) as string[];
    return files;
}

// ============  Emits each name of the files present in a directory and subdirectories =========
// returns and Observable notifies each file found in the directory and all its subdirectories
export function filesObs(fromDirPath: string) {
    fromDirPath = normalizeTilde(fromDirPath);
    return fileListObs(fromDirPath).pipe(concatMap((files) => from(files)));
}

// ============  Emits the list of names of directories present in a directory =========
// returns and Observable which emits the list of names of directories found in the directory passed in as input
export function dirNamesListObs(fromDirPath: string) {
    fromDirPath = normalizeTilde(fromDirPath);
    return new Observable((observer: Observer<string[]>): TeardownLogic => {
        readdir(fromDirPath, { withFileTypes: true }, (err, files) => {
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

// ============  Deletes a directory and subdirectories and emits when completed =========
// returns and Observable which emits null when the directory and all its subdirectories have been deleted or an error otherwise
// export function deleteDirObs(dirPath: string) {
//     return _rimraf(dirPath);
// }
// const _rimraf = Observable.bindCallback(rimraf);
export function deleteDirObs(dirPath: string): Observable<string> {
    dirPath = normalizeTilde(dirPath);
    return new Observable((observer: Observer<string>): TeardownLogic => {
        rimraf(dirPath, (err) => {
            if (err) observer.error(err);
            observer.next(dirPath);
            observer.complete();
        });
    });
}

// ============  Creates a directory and emits when completed =========
// returns and Observable which emits the name of the directory when the directory has been created or an error otherwise
export function makeDirObs(dirPath: string) {
    dirPath = normalizeTilde(dirPath);
    return from(mkdirp(dirPath));
}

// ============  Appends a line to a file and emits when completed =========
// returns and Observable which emits the line appended when the line has been appended or an error otherwise
export function appendFileObs(filePath: string, line: string) {
    filePath = normalizeTilde(filePath);
    return _appendFile(filePath, line);
}
function appendFileNode(filePath: string, line: string, cb: (err, data: string) => void) {
    return fs.appendFile(filePath, line, (err) => {
        cb(err, line);
    });
}
const _appendFile = bindNodeCallback(appendFileNode);

// ============  Deletes a file and emits when completed =========
// returns and Observable which emits the name of the file when the line has been deleted or an error otherwise
export function deleteFileObs(filePath: string) {
    filePath = normalizeTilde(filePath);
    return _deleteFile(filePath);
}
function deleteFileNode(filePath: string, cb: (err, data: string) => void) {
    return fs.unlink(filePath, (err) => {
        cb(err, filePath);
    });
}
const _deleteFile = bindNodeCallback(deleteFileNode);
