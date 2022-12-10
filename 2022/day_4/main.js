const fs = require("fs");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => {
      return line
        .split(",")
        .map((pair) => pair.split("-").map((a) => parseInt(a)));
    })
    .map((pair) =>
      pair.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return b[1] - a[1];
      })
    );
  if (debug) console.log("parsed  file data:", data);
  return data;
};
const firstPairContainsSecond = (pair) => {
  return pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][1];
};
const part1 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  return data.filter(firstPairContainsSecond).length;
};
const pairsOverlap = (pair) => {
  return pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][0];
};
const part2 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  return data.filter(pairsOverlap).length;
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
  correctSampleAnswer: 2,
  correctInputAnswer: null,
});
runPart({
  part: part2,
  correctSampleAnswer: 4,
  correctInputAnswer: null,
});
