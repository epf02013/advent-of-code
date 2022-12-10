const fs = require("fs");
import { uniqueElements } from "../../utilities/array";

type Direction = "U" | "R" | "D" | "L";
type MoveCommand = { direction: Direction; distance: number };
const parseFile = (filename: string, debug: boolean): MoveCommand[] => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line: string) => {
      const [direction, distance] = line.trim().split(" ");
      return { direction, distance: parseInt(distance, 10) };
    });
  if (debug) console.log("parsed  file data:", data);
  return data;
};

function calculateDistance(xDistance: number, yDistance: number) {
  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}

const getKnotPosition = (
  startingKnotPosition: Position,
  leadingKnotPosition: Position
): Position => {
  const xDistance = leadingKnotPosition.x - startingKnotPosition.x;
  const yDistance = leadingKnotPosition.y - startingKnotPosition.y;
  const distance = calculateDistance(xDistance, yDistance);
  if (distance < 2) {
    return startingKnotPosition;
  }
  const endX =
    xDistance !== 0
      ? startingKnotPosition.x + xDistance / Math.abs(xDistance)
      : startingKnotPosition.x;
  const endY =
    yDistance !== 0
      ? startingKnotPosition.y + yDistance / Math.abs(yDistance)
      : startingKnotPosition.y;
  return { x: endX, y: endY };
};
const moveHead = (direction: Direction, startPosition: Position): Position => {
  if (direction === "U") return { ...startPosition, y: startPosition.y + 1 };
  if (direction === "D") return { ...startPosition, y: startPosition.y - 1 };
  if (direction === "L") return { ...startPosition, x: startPosition.x - 1 };
  if (direction === "R") return { ...startPosition, x: startPosition.x + 1 };
  throw "Oops we shouldn't get here in moveHead";
};
type Position = { x: number; y: number };

const moveRope = (
  startKnotPositions: Position[],
  startHeadPosition: Position,
  command: MoveCommand
): {
  visitedPositionsByTail: Position[];
  knotPositions: Position[];
  headPosition;
} => {
  let movedDistance = 0;
  let headPosition = startHeadPosition;
  let knotPositions = startKnotPositions;
  const visitedPositionsByTail: Position[] = [];
  while (movedDistance < command.distance) {
    headPosition = moveHead(command.direction, headPosition);
    const newKnotPositions = [getKnotPosition(knotPositions[0], headPosition)];
    for (let i = 1; i < knotPositions.length; i++) {
      newKnotPositions.push(
        getKnotPosition(
          knotPositions[i],
          newKnotPositions[newKnotPositions.length - 1]
        )
      );
    }
    knotPositions = newKnotPositions;
    visitedPositionsByTail.push(newKnotPositions[newKnotPositions.length - 1]);
    movedDistance++;
  }
  return { visitedPositionsByTail, knotPositions, headPosition };
};
const part1 = (filename, debug = false) => {
  const commands: MoveCommand[] = parseFile(filename, debug);

  let headPosition = { x: 0, y: 0 };
  let bodyPositions = Array(1).fill({ x: 0, y: 0 });
  return getNumberOfPositionsVisitedByTail(
    bodyPositions,
    commands,
    headPosition
  );
};

function getNumberOfPositionsVisitedByTail(
  initialKnotPositions: any[],
  commands: MoveCommand[],
  headPosition: { x: number; y: number }
) {
  let knotPositions = initialKnotPositions;
  let visitedPositionsByTail: Position[] = [
    knotPositions[knotPositions.length - 1],
  ];
  commands.forEach((command) => {
    const moveResult = moveRope(knotPositions, headPosition, command);
    headPosition = moveResult.headPosition;
    knotPositions = moveResult.knotPositions;
    visitedPositionsByTail = visitedPositionsByTail.concat(
      moveResult.visitedPositionsByTail
    );
  });
  const uniquePositions = uniqueElements(
    visitedPositionsByTail.map((p) => `x:${p.x}-y:${p.y}`)
  );
  return uniquePositions.length;
}

const part2 = (filename, debug = false) => {
  const commands: MoveCommand[] = parseFile(filename, debug);
  let headPosition = { x: 0, y: 0 };
  let bodyPositions = Array(9).fill({ x: 0, y: 0 });
  return getNumberOfPositionsVisitedByTail(
    bodyPositions,
    commands,
    headPosition
  );
};

function runPartOnFile({ part, filename, debug, correctAnswer }) {
  console.log(`\nrunning ${part.name} on `, filename);
  const answer = part(filename, debug);
  console.log(`\nanswerfor ${part.name} on ${filename}:`, answer);
  if (correctAnswer && answer !== correctAnswer) {
    throw `oops you broke ${part.name} on ${filename}`;
  }
}

function runPart({
  part,
  correctSampleAnswer,
  correctInputAnswer,
  sampleFileName = "day_9/sample.txt",
}) {
  runPartOnFile({
    part,
    filename: sampleFileName,
    debug: true,
    correctAnswer: correctSampleAnswer,
  });
  runPartOnFile({
    part,
    filename: "day_9/input.txt",
    debug: false,
    correctAnswer: correctInputAnswer,
  });
}
runPart({
  part: part1,
  correctSampleAnswer: 13,
  correctInputAnswer: 6236,
});
runPart({
  part: part2,
  correctSampleAnswer: 36,
  correctInputAnswer: 2449,
  sampleFileName: "day_9/largeSample.txt",
});
