const fs = require("fs");
const { getAllNumbers } = require("../../utilities/string");

const pointsOfLine = (p1, p2) => {
  if (p1.x === p2.x) {
    let minY = Math.min(p1.y, p2.y);
    let maxY = Math.max(p1.y, p2.y);
    const res = [];
    for (let y = minY; y <= maxY; y++) {
      res.push({ x: p1.x, y });
    }
    return res;
  }
  let minX = Math.min(p1.x, p2.x);
  let maxX = Math.max(p1.x, p2.x);
  const res = [];
  for (let x = minX; x <= maxX; x++) {
    res.push({ y: p1.y, x });
  }
  return res;
};
const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => {
      const allPoints = line.split(" -> ").map((p) => {
        const nums = getAllNumbers(p);
        return { x: nums[0], y: nums[1] };
      });
      return allPoints;
    });
  const minimumX = data
    .flatMap((a) => a)
    .reduce((acc, p) => (acc < p.x ? acc : p.x), 501);
  console.log("minimum x:", minimumX);
  const maximumX = data
    .flatMap((a) => a)
    .reduce((acc, p) => (acc > p.x ? acc : p.x), 499);
  console.log("maximum x:", maximumX);
  const minimumY = data
    .flatMap((a) => a)
    .reduce((acc, p) => (acc < p.y ? acc : p.y), 0);
  console.log("minimum y:", minimumY);
  const maximumY = data
    .flatMap((a) => a)
    .reduce((acc, p) => (acc > p.y ? acc : p.y), 0);
  console.log("maximum y:", maximumY);
  if (debug) console.log("parsed  file data:", data);
  const lines = data.map((l) => l.map((p) => ({ x: p.x - minimumX, y: p.y })));
  const grid = new Array(maximumY + 1)
    .fill(undefined)
    .map(() => new Array(maximumX - minimumX + 1).fill("."));
  lines.forEach((line) => {
    let index = 0;
    let startPoint = line[index];
    let nextPoint = line[index + 1];
    while (nextPoint) {
      const linePoints = pointsOfLine(startPoint, nextPoint);
      linePoints.forEach((p) => {
        grid[p.y][p.x] = "#";
      });
      index++;
      startPoint = line[index];
      nextPoint = line[index + 1];
    }
  });
  if (debug) console.log(grid.map((p) => p.join("")).join("\n"));
  return { grid, sandStart: { x: 500 - minimumX, y: 0 } };
};

const parseFilePart2 = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => {
      const allPoints = line.split(" -> ").map((p) => {
        const nums = getAllNumbers(p);
        return { x: nums[0], y: nums[1] };
      });
      return allPoints;
    });
  const minimumX =
    data.flatMap((a) => a).reduce((acc, p) => (acc < p.x ? acc : p.x), 501) -
    10000;
  console.log("minimum x:", minimumX);
  const maximumX =
    data.flatMap((a) => a).reduce((acc, p) => (acc > p.x ? acc : p.x), 499) +
    10000;
  console.log("maximum x:", maximumX);
  const minimumY = data
    .flatMap((a) => a)
    .reduce((acc, p) => (acc < p.y ? acc : p.y), 0);
  console.log("minimum y:", minimumY);
  const maximumY = data
    .flatMap((a) => a)
    .reduce((acc, p) => (acc > p.y ? acc : p.y), 0);
  console.log("maximum y:", maximumY);
  if (debug) console.log("parsed  file data:", data);
  const lines = data.map((l) => l.map((p) => ({ x: p.x - minimumX, y: p.y })));
  const grid = new Array(maximumY + 1)
    .fill(undefined)
    .map(() => new Array(maximumX - minimumX + 1).fill("."));
  lines.forEach((line) => {
    let index = 0;
    let startPoint = line[index];
    let nextPoint = line[index + 1];
    while (nextPoint) {
      const linePoints = pointsOfLine(startPoint, nextPoint);
      linePoints.forEach((p) => {
        grid[p.y][p.x] = "#";
      });
      index++;
      startPoint = line[index];
      nextPoint = line[index + 1];
    }
  });
  grid.push(new Array(maximumX - minimumX + 1).fill("."));
  grid.push(new Array(maximumX - minimumX + 1).fill("#"));
  if (debug) console.log(grid.map((p) => p.join("")).join("\n"));
  return { grid, sandStart: { x: 500 - minimumX, y: 0 } };
};

function pointsToFallToo(point) {
  return [
    { x: point.x, y: point.y + 1 },
    { x: point.x - 1, y: point.y + 1 },
    { x: point.x + 1, y: point.y + 1 },
  ];
}

const placesToFall = (point, grid) => {
  return pointsToFallToo(point).filter(
    (p) => grid[p.y] && grid[p.y][p.x] === "."
  );
};
const isRestingPoint = (point, grid) => {
  return placesToFall(point, grid).length === 0;
};

const findRestPart1 = (sandStart, grid) => {
  let currPosition = sandStart;
  while (currPosition) {
    if (
      pointsToFallToo(currPosition).some((p) => p.x < 0 || p.y >= grid.length)
    )
      return [undefined, true];
    if (isRestingPoint(currPosition, grid)) return [currPosition];
    currPosition = placesToFall(currPosition, grid)[0];
  }
  return [undefined, true];
};
const part1 = (filename, debug = false) => {
  const { grid, sandStart } = parseFile(filename, debug);
  let numberOfPlacedSand = 0;
  while (true) {
    const [restingPoint, fellOffTheMap] = findRestPart1(sandStart, grid);
    if (fellOffTheMap) break;
    grid[restingPoint.y][restingPoint.x] = "o";
    if (debug) console.log(grid.map((a) => a.join("")).join("\n"));
    numberOfPlacedSand++;
  }

  return numberOfPlacedSand;
};
const findRestPart2 = (sandStart, grid) => {
  let currPosition = sandStart;
  while (currPosition) {
    // if (
    //   pointsToFallToo(currPosition).some((p) => p.x < 0 || p.y >= grid.length)
    // )
    //   return [undefined, true];
    if (isRestingPoint(currPosition, grid)) return currPosition;
    currPosition = placesToFall(currPosition, grid)[0];
  }
  throw "oops shouldn't be here";
};
const part2 = (filename, debug = false) => {
  const { grid, sandStart } = parseFilePart2(filename, debug);
  let numberOfPlacedSand = 0;
  while (true) {
    const restingPoint = findRestPart2(sandStart, grid);
    grid[restingPoint.y][restingPoint.x] = "o";
    if (debug) console.log(grid.map((a) => a.join("")).join("\n"));
    numberOfPlacedSand++;
    if (restingPoint.y === 0 && restingPoint.x === sandStart.x) break;
  }

  return numberOfPlacedSand;
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
  correctSampleAnswer: null,
  correctInputAnswer: null,
});
runPart({
  part: part2,
  correctSampleAnswer: null,
  correctInputAnswer: null,
});
