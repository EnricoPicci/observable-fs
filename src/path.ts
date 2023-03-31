import { join } from 'path';
import { homedir } from 'os';

// substitues the tilde symbol with the home directory since the tilde symbol is not recogninzed by readdir function of node fs package
// https://stackoverflow.com/questions/26204935/node-webkit-fs-readdirsync-does-not-work
export function normalizeTilde(_path: string): string {
    if (!_path || !_path.length) {
        return _path;
    }
    const startsWithTilde = _path[0] === '~';
    if (startsWithTilde) {
        return join(homedir(), _path.substring(1));
    }
    return _path;
}
