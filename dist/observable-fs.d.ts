import { Observable } from 'rxjs';
export declare const readLinesObs: (filePath: string) => Observable<string[]>;
export declare const readLineObs: (filePath: string) => Observable<string>;
export declare function writeFileObs(filePath: string, lines: Array<string>): Observable<string>;
export declare function fileListObs(fromDirPath: string): Observable<readonly string[]>;
export declare function filesObs(fromDirPath: string): Observable<string>;
export declare function dirNamesListObs(fromDirPath: string): Observable<string[]>;
export declare function deleteDirObs(dirPath: string): Observable<string>;
export declare function makeDirObs(dirPath: string): Observable<string>;
export declare function makeTempDirObs(prefix: string): Observable<string>;
export declare function appendFileObs(filePath: string, line: string): Observable<string>;
export declare function deleteFileObs(filePath: string): Observable<string>;
