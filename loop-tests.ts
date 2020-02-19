import { performance } from 'perf_hooks'

enum LoopNames {
  ForLoop = 'For Loop',
  ForOf = 'For Of',
  ForEach = 'For Each',
  WhileLoop = 'While Loop',
  Reduce = 'Reduce'
};

interface LoopInfo {
  name: string;
  method: any;
}

interface LoopResults {
  name: string;
  arrayTotal: number;
  exeTime: number;
}

interface AverageLoopResults {
  name: string;
  avgExeTime: number;
}

interface LoopSettings {
  timesToRun: number;
  arrayLength: number;
  minInt: number;
  maxInt: number;
}

function main() {
  const timesToRun = +process.argv[2] || 1000;
  const arrayLength = +process.argv[3] || 100000;
  const minInt = +process.argv[4] || 0;
  const maxInt = +process.argv[5] || 100000;
  const loopSettings = {
    timesToRun: timesToRun,
    arrayLength: arrayLength,
    minInt: minInt,
    maxInt: maxInt
  }
  
  console.log('Loop Speed Tests v0.0.1');
  console.log(`Running ${timesToRun.toLocaleString()} loop tests`);
  console.log(`Array of ${arrayLength.toLocaleString()} random ints`);
  console.log(`Min int value: ${minInt.toLocaleString()}`);
  console.log(`Max int value: ${maxInt.toLocaleString()}\n`);
  
  const finalResults = avgResults(results(loopSettings));
  finalResults.forEach(result => {
    console.log(`Name: ${result.name}\nAverage result: ${(result.avgExeTime)} milliseconds\n`);
  });
}


function avgResults(loopResults: LoopResults[]): AverageLoopResults[] {
  let avgLoopResults: AverageLoopResults[] = [];
  let avgExeTime = 0;
  for (const name of  Object.values(LoopNames)) {
    const loopSet = loopResults.filter(loop => loop.name === name)
    for (const loop of loopSet) {
      avgExeTime = avgExeTime + loop.exeTime;
    }
    const loopAvg = avgExeTime/loopSet.length;
    avgLoopResults.push({name: name, avgExeTime: loopAvg});
  }
  return avgLoopResults;
}


function results(loopSettings: LoopSettings): LoopResults[] {
  let loopResults: LoopResults[] = [];
  for (let i = 0; i < loopSettings.timesToRun; i++)  {
    const loopResult = runLoops(loopSettings.arrayLength, loopSettings.minInt, loopSettings.maxInt);
    loopResult.forEach(loop => {
      loopResults.push({name: loop.name, arrayTotal: loop.arrayTotal, exeTime: loop.exeTime});
    });
  }
  return loopResults;
}


function runLoops(arrayLength: number, min: number, max: number): LoopResults[] {
  const arrayOfNumbers = getRandomIntArray(arrayLength, min, max);
  const loopsToTest: LoopInfo[] = [
    {
      name: LoopNames.ForLoop,
      method: forLoopTimer(arrayOfNumbers)
     }, {
      name: LoopNames.ForOf,
      method: forOfTimer(arrayOfNumbers)
    }, {
      name: LoopNames.ForEach,
      method: forEachTimer(arrayOfNumbers)
    }, {
      name: LoopNames.WhileLoop,
      method: whileLoopTimer(arrayOfNumbers)
    }, {
      name: LoopNames.Reduce,
      method: reduceTimer(arrayOfNumbers)
    }
  ];
  let loopResults: LoopResults[] = [];
  loopsToTest.forEach(loop => {
    loopResults.push(calculateTime(loop));
  });
  return loopResults;
}


function calculateTime(loop: LoopInfo): LoopResults {
  const startTime = performance.now();
  const arrayTotal = loop.method;
  const endTime = performance.now();
  //console.log(`name: ${loop.name}\nloop sum: ${arrayTotal}`); // uncomment to verify totals
  return ({name: loop.name, arrayTotal: arrayTotal, exeTime: (endTime - startTime)});
}


function getRandomIntArray(length: number, min?: number, max?: number) {
  let listOfNumbers = <number[]>[];
  for (let i = 0; i < length; i++) {
    listOfNumbers.push(getRandomInt(min, max));
  }
  return listOfNumbers;
}


function getRandomInt(min: number = Number.MIN_VALUE, max: number = Number.MAX_VALUE): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function forLoopTimer(numbers: number[]) {
  let arrayTotal = 0;
  for (let i = 0; i < numbers.length; i++) {
    arrayTotal = arrayTotal + numbers[i];
  }
  return arrayTotal;
}


function forOfTimer(numbers: number[]) {
  let arrayTotal = 0;
  for (let number of numbers) {
    arrayTotal = arrayTotal + number;
  }
  return arrayTotal;
}


function forEachTimer(numbers: number[]) {
  let arrayTotal = 0;
  numbers.forEach(number => {
    arrayTotal = arrayTotal + number;
  });
  return arrayTotal;
}


function whileLoopTimer(numbers: number[]) {
  let i = 0;
  let arrayTotal = 0;
  while (i < numbers.length) {
    arrayTotal = arrayTotal + numbers[i];
    i++;
  }
  return arrayTotal;
}


function reduceTimer(numbers: number[]) {
  const arrayTotal = numbers.reduce((total, number) => total + number);
  return arrayTotal;
}


main();