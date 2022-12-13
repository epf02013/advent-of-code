const fs = require("fs");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n\n")
    .map((line) => line.split("\n").map((p) => JSON.parse(p)));
  if (debug) console.log("parsed  file data:", data);
  return data;
};
const inOrder = (a, b) => {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      for (let index = 0; index < a.length && index < b.length; index++) {
        const inOrder1 = inOrder(a[index], b[index]);
        if (inOrder1 === "IN_ORDER") return "IN_ORDER";
        if (inOrder1 === "OUT_OF_ORDER") {
          return "OUT_OF_ORDER";
        }
      }
      if (a.length === b.length) {
        return "TIE";
      }
      return a.length < b.length ? "IN_ORDER" : "OUT_OF_ORDER";
    } else {
      return inOrder(a, [b]);
    }
  } else {
    if (Array.isArray(b)) {
      return inOrder([a], b);
    } else {
      if (a < b) {
        return "IN_ORDER";
      }
      return a > b ? "OUT_OF_ORDER" : "TIE";
    }
  }
  throw "oops shouldn't be here";
};
const part1 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  const map = data.map((d) => inOrder(...d));
  return map.reduce(
    (acc, curr, index) => (curr === "IN_ORDER" ? acc + index + 1 : acc),
    0
  );
};

const part2 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  const allPackets = data.flatMap((d) => d);
  const packetsLessThan2 = allPackets
    .map((p) => inOrder(p, [[2]]))
    .filter((a) => a === "IN_ORDER");
  const packetsLessThan6 = allPackets
    .map((p) => inOrder(p, [[6]]))
    .filter((a) => a === "IN_ORDER");
  return (packetsLessThan2.length + 1) * (packetsLessThan6.length + 2);
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
  correctSampleAnswer: 13,
  correctInputAnswer: 4821,
});
runPart({
  part: part2,
  correctSampleAnswer: 140,
  correctInputAnswer: 21890,
});
