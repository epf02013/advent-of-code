const fs = require("fs");
const countLetters = (line) =>
  line.split("").reduce((acc, curr) => {
    const res = { ...acc };
    if (res[curr]) {
      res[curr] += 1;
    } else {
      res[curr] = 1;
    }
    return res;
  }, {});

const parseLine = (line) => {
  const leftContainer = line.slice(0, line.length / 2);
  const rightContainer = line.slice(line.length / 2);
  return [countLetters(leftContainer), countLetters(rightContainer)];
};
const getCommonKey = (a, b) => {
  return Object.keys(a).find((k) => b[k]);
};
const parseFile = (filename) => {
  const data = fs.readFileSync(filename).toString().split("\n").map(parseLine);
  return data;
};
const getIntOfLetter = (letter) => {
  if (letter.toLowerCase() !== letter) {
    const number = letter.charCodeAt(0) - 64;
    return number + 26;
  }
  const number = letter.charCodeAt(0) - 96;
  return number;
};
const part1 = (filename, debug = false) => {
  const rucksacks = parseFile(filename, debug);
  const commonKeys = rucksacks.map(([a, b]) => getCommonKey(a, b));
  const keyCodes = commonKeys.map(getIntOfLetter);
  return keyCodes.reduce((acc, curr) => acc + curr, 0);
};
const splitIntoGroupsOfThree = ([acc, count], curr) => {
  if (count === 2) {
    acc.push([curr]);
    const newVar = [acc, 0];
    return newVar;
  }
  acc[acc.length - 1].push(curr);
  return [acc, count + 1];
};
const getCommonKeysOfLines = (lines) => {
  const foundKeys = {};
  lines.forEach((line) => {
    const uniqueKeys = {};
    line.split("").forEach((c) => (uniqueKeys[c] = 1));
    Object.keys(uniqueKeys).forEach((k) => {
      if (foundKeys[k]) {
        foundKeys[k] += 1;
      } else {
        foundKeys[k] = 1;
      }
    });
  });
  return Object.entries(foundKeys).find(([k, count]) => count === 3)[0];
};
const part2 = (filename, debug = false) => {
  const lines = fs.readFileSync(filename).toString().split("\n");
  const data = lines.reduce(splitIntoGroupsOfThree, [[[]], -1])[0];
  return data
    .map(getCommonKeysOfLines)
    .map(getIntOfLetter)
    .reduce((acc, curr) => acc + curr, 0);
};

function runPartOnFile({ part, filename, debug, correctAnswer }) {
  console.log("\n\n\nrunning " + part.name + " on sample.txt ");
  const answer = part(filename, debug);
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
  correctSampleAnswer: 157,
  correctInputAnswer: 7850,
});
runPart({
  part: part2,
  correctSampleAnswer: 70,
  correctInputAnswer: 2581,
});
