"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import 'mocha';
// import { expect } from 'chai';
const operators_1 = require("rxjs/operators");
const set_version_timestamp_1 = require("./set-version-timestamp");
const observable_fs_1 = require("../observable-fs");
describe('setVersionTimestamp function', () => {
    it('sets version and timestamp on environment.prod.ts file', done => {
        console.log('dirpath', __dirname);
        set_version_timestamp_1.setVersionTimestampObs()
            .pipe(operators_1.switchMap(fileWritten => observable_fs_1.readLinesObs(fileWritten)))
            .subscribe(null, err => {
            console.error(err);
            done(err);
        }, () => done());
    });
});
//# sourceMappingURL=set-version-timestamp.spec.js.map