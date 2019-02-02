import { Observable } from 'rxjs';
export declare const readLinesObs: (arg1: string) => Observable<string[]>;
export declare function writeFileObs(filePath: string, lines: Array<string>): Observable<string>;
export declare function fileListObs(fromDirPath: string): Observable<string[]>;
export declare function filesObs(fromDirPath: string): Observable<string>;
export declare function deleteDirObs(dirPath: string): Observable<string>;
export declare function makeDirObs(dirPath: string): Observable<{}>;
export declare function appendFileObs(filePath: string, line: string): Observable<string>;
export declare function deleteFileObs(filePath: string): Observable<string>;
