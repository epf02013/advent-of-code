const fs = require("fs");
const { chunk } = require("../utilities/array");
const parseMove = (moveStr) => {
  const regex = /(\d+).*(\d+).*(\d+)/;
  const [_, numToMove, startColumn, endColumn] = moveStr.match(regex);
  return { startColumn: startColumn - 1, endColumn: endColumn - 1, numToMove };
};

const parseStacks = (stackDefinition) => {
  const stackDescriptions = stackDefinition.split("\n 1")[0];
  const stackRows = stackDescriptions.split("\n").map((a) => {
    return chunk(4)(a).map((c) => c[1]);
  });
  const stacks = Array(stackRows[0].length)
    .fill(null)
    .map((_) => []);
  stackRows.reverse().forEach((r) => {
    r.forEach((item, col) => {
      if (item !== " ") stacks[col].push(item);
    });
  });
  return stacks;
};
const parseFile = (filename, debug) => {
  const [stackDefinition, moveDefinitions] = fs
    .readFileSync(filename)
    .toString()
    .split("\n\n");

  const stacks = parseStacks(stackDefinition);
  const moveList = moveDefinitions.split("\n").map(parseMove);
  return { stacks, moveList };
};
const handlePart1Move = (stacks, move) => {
  for (let i = 0; i < move.numToMove; i++) {
    stacks[move.endColumn].push(stacks[move.startColumn].pop());
  }
};
const part1 = (filename, debug = false) => {
  const { stacks, moveList } = parseFile(filename, debug);
  moveList.forEach((move) => {
    handlePart1Move(stacks, move);
  });
  return stacks.map((stack) => stack.pop()).join("");
};

const handlePart2Move = (stacks, move) => {
  const toMove = [];
  for (let i = 0; i < move.numToMove; i++) {
    toMove.push(stacks[move.startColumn].pop());
  }
  toMove.reverse().forEach((a) => {
    stacks[move.endColumn].push(a);
  });
};
const part2 = (filename, debug = false) => {
  const { stacks, moveList } = parseFile(filename, debug);
  moveList.forEach((move) => {
    handlePart2Move(stacks, move);
  });
  return stacks.map((stack) => stack.pop()).join("");
};

function runPartOnFile({ part, filename, debug, correctAnswer }) {
  console.log("\n\n\nrunning " + part.name + " on ", filename);
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
  correctSampleAnswer: "CMZ",
  correctInputAnswer: "QNHWJVJZW",
});
runPart({
  part: part2,
  correctSampleAnswer: "MCD",
  correctInputAnswer: "BPCZJLFJW",
});
