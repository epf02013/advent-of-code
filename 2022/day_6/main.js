const fs = require("fs");
const { uniqueElements } = require("../../utilities/array");

const parseFile = (filename, debug) => {
  const data = fs.readFileSync(filename).toString().split("\n")[0].split("");
  if (debug) console.log("parsed  file data:", data);
  return data;
};
const part1 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  let uniqueLetterCount = 4;
  const last4 = data.slice(0, uniqueLetterCount);
  for (let index = uniqueLetterCount; index < data.length; index++) {
    if (uniqueElements(last4).length === uniqueLetterCount) return index;
    const letter = data[index];
    last4.shift();
    last4.push(letter);
  }
  throw "oops shouldnt have gotten here";
};

const part2 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  let uniqueLetterCount = 14;
  const last14 = data.slice(0, uniqueLetterCount);
  for (let index = uniqueLetterCount; index < data.length; index++) {
    if (uniqueElements(last14).length === uniqueLetterCount) return index;
    const letter = data[index];
    last14.shift();
    last14.push(letter);
  }
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
  correctSampleAnswer: 7,
  correctInputAnswer: 1282,
});
runPart({
  part: part2,
  correctSampleAnswer: 19,
  correctInputAnswer: 3513,
});
