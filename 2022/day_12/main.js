const fs = require("fs");
const { gridNeighbours } = require("../../utilities/grid");
const { bfs } = require("../../utilities/graph/bfs");
const parseFile = (filename, debug) => {
  const grid = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => line.split(""));
  let startPoint = null;
  let endPoint = null;
  const gridWithStartAndEndReplacedWithAAndZ = grid.map((row, y) =>
    row.map((value, x) => {
      if (value === "S") {
        startPoint = { y, x, key: pointKey({ x, y }) };
        return "a";
      }
      if (value === "E") {
        endPoint = { y, x, key: pointKey({ x, y }) };
        return "z";
      }
      return value;
    })
  );
  return { grid: gridWithStartAndEndReplacedWithAAndZ, startPoint, endPoint };
};
const getNeighboursOfPoint = (grid) => (point) => {
  const neighbourPoints = gridNeighbours(grid)(point);
  return neighbourPoints
    .filter((n) => {
      return (
        grid[n.y][n.x].charCodeAt(0) <= grid[point.y][point.x].charCodeAt(0) + 1
      );
    })
    .map((p) => ({ ...p, key: pointKey(p) }));
};
const pointKey = (point) => `x:${point.x},y:${point.y}`;
const part1 = (filename, debug = false) => {
  const { grid, startPoint, endPoint } = parseFile(filename, debug);
  return (
    bfs({
      getNeighbours: getNeighboursOfPoint(grid),
      start: startPoint,
      end: endPoint,
    }).length - 1
  );
};
const part2 = (filename, debug = false) => {
  const { grid, endPoint } = parseFile(filename, debug);
  const startingPoints = [];
  grid.forEach((row, y) =>
    row.map((val, x) => {
      if (val === "a") {
        startingPoints.push({ x, y });
      }
    })
  );
  const pathLengths = startingPoints
    .map((p) => {
      const path = bfs({
        getNeighbours: getNeighboursOfPoint(grid),
        start: p,
        end: endPoint,
      });
      if (!path) return undefined;
      return path.length - 1;
    })
    .filter((a) => a);
  return pathLengths.sort((a, b) => a - b)[0];
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
  correctSampleAnswer: 31,
  correctInputAnswer: 534,
});
runPart({
  part: part2,
  correctSampleAnswer: 29,
  correctInputAnswer: 525,
});
