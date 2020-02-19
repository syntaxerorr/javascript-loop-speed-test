# Javascript loop tests

There are many ways to iterate over a data set. 

This script will iterate over an array of integers and add them together.

Which is fastest?

### To build
`tsc loop-tests.ts`

### To run
`node loop-tests.js`

***Or chose your own settings***
`node loop-test.js timesToRun arrayLength minInit maxInt`

```
const timesToRun = +process.argv[2] || 1000;
const arrayLength = +process.argv[3] || 100000;
const minInt = +process.argv[4] || 0;
const maxInt = +process.argv[5] || 100000;
```
