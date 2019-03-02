
// // import 'mocha';
// // import { expect } from 'chai';
// import { switchMap, } from 'rxjs/operators';

// import {setVersionTimestampObs} from './set-version-timestamp';
// import {readLinesObs, } from '../observable-fs';

// describe('setVersionTimestamp function', () => {
    
//     it('sets version and timestamp on environment.prod.ts file', done => {
//         console.log('dirpath', __dirname);
//         setVersionTimestampObs()
//         .pipe(
//             switchMap(fileWritten => readLinesObs(fileWritten)),
//             // tap(newLines => {
//             //     const addedLines
//             //     expect()
//             // })
//         )
//         .subscribe(
//             null, 
//             err => {
//                 console.error(err);
//                 done(err);
//             },
//             () => done()
//         );
//     })

// });
