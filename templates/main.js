const fs = require("fs");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => {});
  if (debug) console.log("parsed  file data:", data);
  return data;
};
const part1 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  return data;
};

const part2 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  return data;
};

function runPartOnFile({ part, filename, debug, correctAnswer }) {
  console.log(`\nrunning ${part.name} on `, filename);
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
  correctSampleAnswer: null,
  correctInputAnswer: null,
});
// runPart({
//   part: part2,
//   correctSampleAnswer: null,
//   correctInputAnswer: null,
// });
