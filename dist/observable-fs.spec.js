"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const _ = require("lodash");
const operators_1 = require("rxjs/operators");
const observable_fs_1 = require("./observable-fs");
const observable_fs_2 = require("./observable-fs");
const observable_fs_3 = require("./observable-fs");
describe('filesObs function', () => {
    it('reads the files of a directory', (done) => {
        const files = new Array();
        const dirPath = 'observable-fs-test-dir/';
        (0, observable_fs_1.filesObs)(dirPath).subscribe({
            next: (file) => files.push(file),
            error: (err) => {
                console.error('ERROR', err);
            },
            complete: () => {
                console.log('files', files);
                if (files.length !== 3) {
                    console.error(dirPath, files);
                    return done(new Error('files count failed'));
                }
                return done();
            },
        });
    });
    it.only('reads the files of a directory', (done) => {
        const files = new Array();
        const dirPath = '~/enrico-code/my-npm-packages/observable-fs/observable-fs-test-dir';
        (0, observable_fs_1.filesObs)(dirPath).subscribe({
            next: (file) => files.push(file),
            error: (err) => {
                console.error('ERROR', err);
            },
            complete: () => {
                console.log('files', files);
                if (files.length !== 3) {
                    console.error(dirPath, files);
                    return done(new Error('files count failed'));
                }
                return done();
            },
        });
    });
});
describe('dirNamesListObs function', () => {
    it('reads the subdirectories of a directory', (done) => {
        const dirPath = 'observable-fs-test-dir/';
        (0, observable_fs_1.dirNamesListObs)(dirPath).subscribe({
            next: (dirs) => {
                (0, chai_1.expect)(dirs.length).to.equal(2);
                (0, chai_1.expect)(dirs.filter((d) => d === 'dir-1').length).to.equal(1);
                (0, chai_1.expect)(dirs.filter((d) => d === 'dir-1').length).to.equal(1);
            },
            error: (err) => {
                console.error('ERROR', err);
            },
            complete: () => {
                return done();
            },
        });
    });
});
describe('readLinesObs function', () => {
    it('reads all the lines of a file', (done) => {
        const filePath = 'observable-fs-test-dir/dir-2/file-2-1.txt';
        (0, observable_fs_1.readLinesObs)(filePath).subscribe({
            next: (lines) => {
                console.log('lines', lines);
                if (lines.length !== 5) {
                    console.error(filePath, lines);
                    return done(new Error('lines count failed'));
                }
                return done();
            },
            error: (err) => {
                console.error('ERROR', err);
            },
            complete: () => console.log('COMPLETED'),
        });
    });
});
describe('readLineObs function', () => {
    it('reads each line of a file', (done) => {
        let lineCounter = 0;
        const filePath = 'observable-fs-test-dir/dir-2/file-2-1.txt';
        (0, observable_fs_1.readLineObs)(filePath).subscribe({
            next: () => lineCounter++,
            error: (err) => {
                console.error('ERROR', err);
            },
            complete: () => {
                if (lineCounter !== 5) {
                    console.error('Number of lines read not as expected', filePath, lineCounter);
                    return done(new Error('readLineObs failed'));
                }
                console.log('COMPLETED');
                done();
            },
        });
    });
});
describe('writeFileObs function', () => {
    it('writes a file with a certain content', (done) => {
        const dirPath = 'observable-fs-test-dir-output/';
        const fileName = 'file-w.txt';
        const fullFileName = dirPath + fileName;
        const content = ['first line', 'second line'];
        // delete the target directory if it exists
        (0, observable_fs_1.deleteDirObs)(dirPath)
            .pipe(
        // writes the file and then runs the checks
        (0, operators_1.switchMap)((deletedDir) => (0, observable_fs_1.writeFileObs)(deletedDir + fileName, content)), 
        // checks that the file name is emitted
        (0, operators_1.tap)((data) => {
            if (fullFileName !== data) {
                console.error('data emitted', data);
                console.error('fullFileName', dirPath + fileName);
                return done(new Error('data emitted by write failed'));
            }
        }), 
        // checks, via filesObs function, that a file with the expected name exists
        (0, operators_1.switchMap)(() => (0, observable_fs_1.filesObs)(dirPath)), (0, operators_1.tap)((filePath) => {
            if (filePath !== fullFileName) {
                console.error('filePath', filePath);
                console.error('fullFileName', fullFileName);
                return done(new Error('write file failed'));
            }
        }), 
        // removes the directory used for the test
        (0, operators_1.switchMap)(() => (0, observable_fs_1.deleteDirObs)(dirPath)))
            .subscribe({
            error: (err) => {
                (0, observable_fs_1.deleteDirObs)(dirPath).subscribe();
                done(err);
            },
            complete: () => done(),
        });
    });
});
describe('makeDirObs function', () => {
    it('tries to create a directory - at the end it deletes the directory', (done) => {
        const dirName = 'new dir';
        (0, observable_fs_1.makeDirObs)(dirName).subscribe({
            next: (data) => {
                const expectedData = process.cwd() + '/' + dirName;
                if (data !== expectedData) {
                    console.error('expectedData', expectedData);
                    console.error('data', data);
                    return done(new Error('data not as expected '));
                }
            },
            error: (err) => console.error(err),
            complete: () => {
                (0, observable_fs_1.deleteDirObs)(dirName).subscribe();
                done();
            },
        });
    });
    it('tries to create a directory first and then the same directory - at the end it deletes the directory', (done) => {
        const dirName = 'another new dir';
        (0, observable_fs_1.makeDirObs)(dirName)
            .pipe(
        // checks that the data received is equal to the name of the directory created
        (0, operators_1.tap)((data) => {
            const expectedDirPath = process.cwd() + '/' + dirName;
            if (data !== expectedDirPath) {
                console.error('expectedData', expectedDirPath);
                console.error('data', data);
                throw Error('data not as expected ');
            }
        }), (0, operators_1.switchMap)(() => (0, observable_fs_1.makeDirObs)(dirName)), 
        // checks that the data received is null, since this signals that the directory we tried to create already existis
        (0, operators_1.tap)((data) => {
            if (data) {
                console.error('expectedData', null);
                console.error('data', data);
                throw Error('data not as expected ');
            }
        }))
            .subscribe({
            error: (err) => {
                (0, observable_fs_1.deleteDirObs)(dirName).subscribe();
                done(err);
            },
            complete: () => {
                (0, observable_fs_1.deleteDirObs)(dirName).subscribe();
                done();
            },
        });
    });
});
describe('appendFileObs function', () => {
    it('appends 2 lines to a file', (done) => {
        const logFile = 'log.txt';
        const line = 'I am a line';
        const linePlusReturn = line + '\n';
        (0, observable_fs_2.appendFileObs)(logFile, linePlusReturn)
            .pipe((0, operators_1.switchMap)((data) => {
            // removes the last char which is carriage return - this should be the line appended
            const lineEmitted = data.substr(0, data.length - 1);
            return (0, observable_fs_2.appendFileObs)(logFile, lineEmitted);
        }))
            .subscribe({
            error: (err) => {
                console.error('ERROR', err);
                done(err);
            },
            complete: () => {
                (0, observable_fs_1.readLinesObs)(logFile).subscribe((lines) => {
                    const linesExpected = [line, line];
                    const areLinesCorrect = _.isEqual(lines, linesExpected);
                    if (!areLinesCorrect) {
                        console.error('lines logged:', lines);
                        console.error('lines expected:', linesExpected);
                        return done(new Error('appends 2 lines to a file failed'));
                    }
                    (0, observable_fs_3.deleteFileObs)(logFile).subscribe();
                    done();
                });
            },
        });
    });
});
//# sourceMappingURL=observable-fs.spec.js.map