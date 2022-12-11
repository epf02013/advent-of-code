const fs = require("fs");
const { getAllNumbers } = require("../../utilities/string");

function parseMonkeyString(monkey) {
  const split = monkey.split("\n");
  const itemWorries = getAllNumbers(split[1]);
  const newWorryFunc = split[2].split("= ")[1];
  const testDivisibleBy = getAllNumbers(split[3])[0];
  const whenDivisible = getAllNumbers(split[4])[0];
  const whenNotDivisible = getAllNumbers(split[5])[0];
  return {
    itemWorries,
    newWorryFunc,
    testDivisibleBy,
    whenDivisible,
    whenNotDivisible,
  };
}

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n\n")
    .map((monkey) => {
      const {
        itemWorries,
        newWorryFunc,
        testDivisibleBy,
        whenDivisible,
        whenNotDivisible,
      } = parseMonkeyString(monkey);
      return {
        inspections: 0,
        items: itemWorries,
        getNewWorry: (old) => Math.floor(eval(newWorryFunc) / 3),
        getNextMonkey: (worry) =>
          worry % testDivisibleBy === 0 ? whenDivisible : whenNotDivisible,
      };
    });
  return data;
};
const parse2File = (filename, debug) => {
  const monkeyStrings = fs.readFileSync(filename).toString().split("\n\n");

  const monkeys = monkeyStrings.map((monkey, index) => {
    const {
      itemWorries,
      newWorryFunc,
      testDivisibleBy,
      whenDivisible,
      whenNotDivisible,
    } = parseMonkeyString(monkey);
    return {
      inspections: 0,
      items: itemWorries.map((n) => new Array(monkeyStrings.length).fill(n)),
      newWorryFunc,
      getNextMonkey: (worry) =>
        worry[index] % testDivisibleBy === 0 ? whenDivisible : whenNotDivisible,
      testDivisibleBy,
    };
  });
  const divisibleBys = monkeys.map((m) => m.testDivisibleBy);
  const getWorryValue = (worry, index) => worry % divisibleBys[index];
  const monkeysWithGetNewWorry = monkeys.map((m) => ({
    ...m,
    getNewWorry: (worries) =>
      worries.map((old) => eval(m.newWorryFunc)).map(getWorryValue),
  }));
  return monkeysWithGetNewWorry;
};
const inspect = (monkey) => {
  const items = monkey.items;
  monkey.items = [];
  return items.map((worry) => {
    monkey.inspections++;
    return [
      monkey.getNewWorry(worry),
      monkey.getNextMonkey(monkey.getNewWorry(worry)),
    ];
  });
};
function calculateMonkeyBusinessAtRound(numberOfRounds, monkeys) {
  for (let round = 0; round < numberOfRounds; round++) {
    monkeys.forEach((monkey, index) => {
      const itemsToSend = inspect(monkey, index);
      itemsToSend.forEach(([newWorry, nextMonkeyIndex]) => {
        monkeys[nextMonkeyIndex].items.push(newWorry);
      });
    });
  }
  const sortedInspections = monkeys
    .map((m) => m.inspections)
    .sort((a, b) => b - a);
  return sortedInspections[0] * sortedInspections[1];
}
const part1 = (filename, debug = false) => {
  const monkeys = parseFile(filename, debug);
  return calculateMonkeyBusinessAtRound(20, monkeys);
};

const part2 = (filename, debug = false) => {
  const monkeys = parse2File(filename, debug);
  return calculateMonkeyBusinessAtRound(10000, monkeys);
};

function runPartOnFile({ part, filename, debug, correctAnswer }) {
  console.log(`\nrunning ${part.name} on `, filename);
  const answer = part(`${__dirname}/${filename}`, debug);
  console.log(`\nanswerfor ${part.name} on ${filename}:`, answer);
  if (correctAnswer && answer !== correctAnswer) {
    throw `oops you broke ${part.name} on ${filename}`;
  }
}

function runPart({ part, correctSampleAnswer, correctInputAnswer }) {
  runPartOnFile({
    part,
    filename: "sample.txt",
    debug: true,
    correctAnswer: correctSampleAnswer,
  });
  runPartOnFile({
    part,
    filename: "input.txt",
    debug: false,
    correctAnswer: correctInputAnswer,
  });
}
runPart({
  part: part1,
  correctSampleAnswer: 10605,
  correctInputAnswer: 50830,
});
runPart({
  part: part2,
  correctSampleAnswer: 2713310158,
  correctInputAnswer: 14399640002,
});
