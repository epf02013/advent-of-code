const fs = require("fs");
const { chunk } = require("../../utilities/array");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .flatMap((line) => {
      if (line === "noop") return line;
      return ["noop", line];
    });
  return data;
};

const startSystem = () => {};

function getValues(data) {
  const [values] = data.reduce(
    ([acc, currXValue], instruction, index) => {
      if (instruction === "noop") {
        acc.push([currXValue, currXValue * (index + 1), index + 1]);
        return [acc, currXValue];
      }
      const number = parseInt(instruction.split(" ")[1], 10);
      const newX = currXValue + number;
      acc.push([currXValue, currXValue * (index + 1), index + 1]);
      return [acc, newX];
    },
    [[[1, 0]], 1]
  );
  return values;
}

const part1 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  const values = getValues(data);

  return (
    values[20][1] +
    values[60][1] +
    values[100][1] +
    values[140][1] +
    values[180][1] +
    values[220][1]
  );
};

const part2 = (filename, debug = false) => {
  const data = parseFile(filename, debug);
  const xValuesAtEachCycle = getValues(data).map(([xValue]) => xValue);
  const pixelStates = chunk(40)(xValuesAtEachCycle.slice(1))
    .map((p) =>
      p.map((value, index) => {
        if (value - 1 === index || value === index || value + 1 === index)
          return "#";
        return ".";
      })
    )
    .map((p) => p.join(""))
    .join("\n");
  return "\n" + pixelStates;
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
    filename: "/sample.txt",
    debug: true,
    correctAnswer: correctSampleAnswer,
  });
  runPartOnFile({
    part,
    filename: "/input.txt",
    debug: false,
    correctAnswer: correctInputAnswer,
  });
}
runPart({
  part: part1,
  correctSampleAnswer: 13140,
  correctInputAnswer: 13060,
});
runPart({
  part: part2,
  correctSampleAnswer: `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
  correctInputAnswer: `
####...##.#..#.###..#..#.#....###..####.
#.......#.#..#.#..#.#..#.#....#..#....#.
###.....#.#..#.###..#..#.#....#..#...#..
#.......#.#..#.#..#.#..#.#....###...#...
#....#..#.#..#.#..#.#..#.#....#.#..#....
#.....##...##..###...##..####.#..#.####.`,
});
