const { addPoints } = require("../../utilities/grid");

const fs = require("fs");
const { getAllNumbers } = require("../../utilities/string");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => {
      const [sx, sy, bx, by] = getAllNumbers(line);
      return [
        { x: sx, y: sy },
        { x: bx, y: by },
      ];
    });
  if (debug) console.log("parsed  file data:", data);
  return data;
};

const distanceBetweenPoints = (p1, p2) => {
  return Math.abs(p1.x - p2.x, 2) + Math.abs(p1.y - p2.y, 2);
};
const getPointData = (data) => {
  const minX = data
    .flatMap((a) => a)
    .reduce(
      (acc, curr) => (acc < curr.x ? acc : curr.x),
      Number.POSITIVE_INFINITY
    );
  const maxX = data
    .flatMap((a) => a)
    .reduce(
      (acc, curr) => (acc > curr.x ? acc : curr.x),
      Number.NEGATIVE_INFINITY
    );

  const minY = data
    .flatMap((a) => a)
    .reduce(
      (acc, curr) => (acc < curr.y ? acc : curr.y),
      Number.POSITIVE_INFINITY
    );
  const maxY = data
    .flatMap((a) => a)
    .reduce(
      (acc, curr) => (acc > curr.y ? acc : curr.y),
      Number.NEGATIVE_INFINITY
    );
  console.log("minX", minX);
  console.log("maxX", maxX);
  console.log("minY", minY);
  console.log("maxY", maxY);
  return { maxX, minX, maxY, minY };
};
const part1 = (filename, debug = false) => {
  const sensorToBeaconLines = parseFile(filename, debug);
  const { minX, maxX } = getPointData(sensorToBeaconLines);
  let count = 0;
  const points = [];
  for (let x = minX - 2000000; x < maxX + 2000000; x++) {
    const pointOnLine = { x, y: debug ? 10 : 2000000 };
    const mustBeEmpty = sensorToBeaconLines.some((line) => {
      const distanceBetweenSensorAndBeacon = distanceBetweenPoints(...line);
      const distanceToPointOnLine = distanceBetweenPoints(line[0], pointOnLine);
      return distanceToPointOnLine <= distanceBetweenSensorAndBeacon;
    });
    const isBeacon = sensorToBeaconLines.some((line) => {
      return pointOnLine.x === line[1].x && line[1].y === pointOnLine.y;
    });

    if (mustBeEmpty && !isBeacon) {
      if (debug) points.push(pointOnLine);
      count++;
    }
  }
  // const lineForRowOfInterest = getPointData(sensorToBeaconLines); //calculate minX,maxX then return minX-100,000 -> maxX+100,000
  //
  // const sensorToBeaconLinesThatIntersectRow =
  //   sensorToBeaconLines.map(line => ({line, intersectPoint: intersectPoint(line,lineForRowOfInterest)})).filter(a => a.intersectPoint);
  // const linesWhereBeaconsCantBe = sensorToBeaconLinesThatIntersectRow.map(a => calculatePointsThatMustBeEmpty(a.line,a.intersectPoint,lineForRowOfInterest))
  if (debug) console.log(points);
  return count;
};
const pointsAtDistance = (point, distance) => {
  const points = [];
  for (let i = 0; i <= distance; i++) {
    if (i !== 0 && i !== distance) {
      points.push(addPoints(point, { x: -i, y: distance - i }));
      points.push(addPoints(point, { x: -i, y: -(distance - i) }));
    }
    points.push(addPoints(point, { x: i, y: distance - i }));
    points.push(addPoints(point, { x: i, y: -(distance - i) }));
  }
  return points;
};
module.exports = {
  pointsAtDistance,
};

function couldThisBeTheBeacon(sensorToBeaconLines, potentialPoint) {
  const couldBeBeacon = sensorToBeaconLines.every((line) => {
    const distanceBetweenSensorAndBeacon = distanceBetweenPoints(...line);
    const distanceToPointOnLine = distanceBetweenPoints(
      line[0],
      potentialPoint
    );
    const b = distanceToPointOnLine > distanceBetweenSensorAndBeacon;
    return b;
  });
  const isBeacon = sensorToBeaconLines.some((line) => {
    return potentialPoint.x === line[1].x && line[1].y === potentialPoint.y;
  });

  const couldBeTheBeacon = couldBeBeacon && !isBeacon;
  return couldBeTheBeacon;
}

const part2 = (filename, debug = false) => {
  const sensorToBeaconLines = parseFile(filename, debug);
  const { minX, maxX, minY, maxY } = debug
    ? { minX: 0, maxX: 20, minY: 0, maxY: 20 }
    : { minX: 0, maxX: 4000000, minY: 0, maxY: 4000000 };
  const pointsToCheck = sensorToBeaconLines
    .slice(0, 15)
    .flatMap((l, index) => {
      return pointsAtDistance(l[0], distanceBetweenPoints(...l) + 1);
    })
    .filter((p) => p.x >= minX && p.x <= maxX && p.y <= maxY && p.y >= minY);
  const point = pointsToCheck.find((potentialPoint) => {
    const couldBeTheBeacon = couldThisBeTheBeacon(
      sensorToBeaconLines,
      potentialPoint
    );
    return couldBeTheBeacon;
  });
  return point.x * 4000000 + point.y;
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
  correctSampleAnswer: 26,
  correctInputAnswer: 4560025,
});
runPart({
  part: part2,
  correctSampleAnswer: 56000011,
  correctInputAnswer: 12480406634249,
});
