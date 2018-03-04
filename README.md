[![Build Status](https://travis-ci.org/EnricoPicci/observable-fs.svg?branch=master)](https://travis-ci.org/EnricoPicci/observable-fs)
[![Coverage Status](https://coveralls.io/repos/github/EnricoPicci/observable-fs/badge.svg?branch=master)](https://coveralls.io/github/EnricoPicci/observable-fs?branch=master)

# observable-fs
Provides as Observables some of the APIs of node fs

- **readLinesObs**: reads a file and, when finished, emits an array containing all the lines of the file
- **writeFileObs**: writes a file and emits the name of the file when the write operation is completed
- **filesObs**: reads all the files present in a directory and its subdirectories and emits an array with the names of the files
- **makeDirObs**: creates a directory and emits the name of the directory created when the operation is completed
- **deleteDirObs**: deletes a directory and emits the name of the directory deleted when the operation is completed
- **appendFileObs**: append a line at the end of a file and emits when the operation is completed
- **deleteFileObs**: deletes a file and emits the name of the file deleted when the operation is completed
