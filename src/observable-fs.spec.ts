import 'mocha';
import { expect } from 'chai';
import * as _ from 'lodash';

import { switchMap, tap } from 'rxjs/operators';

import {
    readLinesObs,
    writeFileObs,
    filesObs,
    makeDirObs,
    deleteDirObs,
    readLineObs,
    dirNamesListObs,
} from './observable-fs';
import { appendFileObs } from './observable-fs';
import { deleteFileObs } from './observable-fs';

describe('filesObs function', () => {
    it('reads the files of a directory', (done) => {
        const files = new Array<string>();
        const dirPath = 'observable-fs-test-dir/';
        filesObs(dirPath).subscribe({
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
        dirNamesListObs(dirPath).subscribe({
            next: (dirs) => {
                expect(dirs.length).to.equal(2);
                expect(dirs.filter((d) => d === 'dir-1').length).to.equal(1);
                expect(dirs.filter((d) => d === 'dir-1').length).to.equal(1);
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
        readLinesObs(filePath).subscribe({
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
        readLineObs(filePath).subscribe({
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
        deleteDirObs(dirPath)
            .pipe(
                // writes the file and then runs the checks
                switchMap((deletedDir) => writeFileObs(deletedDir + fileName, content)),
                // checks that the file name is emitted
                tap((data) => {
                    if (fullFileName !== data) {
                        console.error('data emitted', data);
                        console.error('fullFileName', dirPath + fileName);
                        return done(new Error('data emitted by write failed'));
                    }
                }),
                // checks, via filesObs function, that a file with the expected name exists
                switchMap(() => filesObs(dirPath)),
                tap((filePath) => {
                    if (filePath !== fullFileName) {
                        console.error('filePath', filePath);
                        console.error('fullFileName', fullFileName);
                        return done(new Error('write file failed'));
                    }
                }),
                // removes the directory used for the test
                switchMap(() => deleteDirObs(dirPath)),
            )
            .subscribe({
                error: (err) => {
                    deleteDirObs(dirPath).subscribe();
                    done(err);
                },
                complete: () => done(),
            });
    });
});

describe('makeDirObs function', () => {
    it('tries to create a directory - at the end it deletes the directory', (done) => {
        const dirName = 'new dir';
        makeDirObs(dirName).subscribe({
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
                deleteDirObs(dirName).subscribe();
                done();
            },
        });
    });

    it('tries to create a directory first and then the same directory - at the end it deletes the directory', (done) => {
        const dirName = 'another new dir';
        makeDirObs(dirName)
            .pipe(
                // checks that the data received is equal to the name of the directory created
                tap((data) => {
                    const expectedDirPath = process.cwd() + '/' + dirName;
                    if (data !== expectedDirPath) {
                        console.error('expectedData', expectedDirPath);
                        console.error('data', data);
                        throw Error('data not as expected ');
                    }
                }),
                switchMap(() => makeDirObs(dirName)),
                // checks that the data received is null, since this signals that the directory we tried to create already existis
                tap((data) => {
                    if (data) {
                        console.error('expectedData', null);
                        console.error('data', data);
                        throw Error('data not as expected ');
                    }
                }),
            )
            .subscribe({
                error: (err) => {
                    deleteDirObs(dirName).subscribe();
                    done(err);
                },
                complete: () => {
                    deleteDirObs(dirName).subscribe();
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
        appendFileObs(logFile, linePlusReturn)
            .pipe(
                switchMap((data) => {
                    // removes the last char which is carriage return - this should be the line appended
                    const lineEmitted = data.substr(0, data.length - 1);
                    return appendFileObs(logFile, lineEmitted);
                }),
            )
            .subscribe({
                error: (err) => {
                    console.error('ERROR', err);
                    done(err);
                },
                complete: () => {
                    readLinesObs(logFile).subscribe((lines) => {
                        const linesExpected = [line, line];
                        const areLinesCorrect = _.isEqual(lines, linesExpected);
                        if (!areLinesCorrect) {
                            console.error('lines logged:', lines);
                            console.error('lines expected:', linesExpected);
                            return done(new Error('appends 2 lines to a file failed'));
                        }
                        deleteFileObs(logFile).subscribe();
                        done();
                    });
                },
            });
    });
});
