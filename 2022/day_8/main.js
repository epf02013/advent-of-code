const fs = require("fs");

const parseFile = (filename, debug) => {
  const data = fs
    .readFileSync(filename)
    .toString()
    .split("\n")
    .map((line) => line.split("").map((l) => parseInt(l, 10)));
  return data;
};

function checkRow({ treeGrid, startIndex, endIndex, increment, comparison }) {
  const visible = {};
  for (let row = 0; row < treeGrid.length; row++) {
    let max = -1;
    for (let col = startIndex; comparison(col, endIndex); col += increment) {
      if (treeGrid[row][col] > max) {
        max = treeGrid[row][col];
        visible[row + "," + col] = treeGrid[row][col];
      }
    }
  }
  return visible;
}

function checkCol({ treeGrid, startIndex, endIndex, increment, comparison }) {
  const visible = {};
  for (let col = 0; col < treeGrid[0].length; col++) {
    let max = -1;
    for (let row = startIndex; comparison(row, endIndex); row += increment) {
      if (treeGrid[row][col] > max) {
        max = treeGrid[row][col];
        visible[row + "," + col] = treeGrid[row][col];
      }
    }
  }
  return visible;
}

const part1 = (filename, debug = false) => {
  const treeGrid = parseFile(filename, debug);
  const rowVisibleLeftToRight = checkRow({
    treeGrid,
    startIndex: 0,
    endIndex: treeGrid[0].length,
    increment: 1,
    comparison: (a, b) => a < b,
  });
  const rowVisibleRightToLeft = checkRow({
    treeGrid,
    startIndex: treeGrid[0].length - 1,
    endIndex: 0,
    increment: -1,
    comparison: (a, b) => a >= b,
  });
  const colVisibleTopDown = checkCol({
    treeGrid,
    startIndex: 0,
    endIndex: treeGrid.length,
    increment: 1,
    comparison: (a, b) => a < b,
  });
  const colVisibleBottomUp = checkCol({
    treeGrid,
    startIndex: treeGrid.length - 1,
    endIndex: 0,
    increment: -1,
    comparison: (a, b) => a >= b,
  });
  const visible = {
    ...rowVisibleLeftToRight,
    ...rowVisibleRightToLeft,
    ...colVisibleTopDown,
    ...colVisibleBottomUp,
  };
  return Object.keys(visible).length;
};

const checkDirection = ({ getNextTree }) => {
  const startTreeHeight = getNextTree();
  let nextTreeHeight = getNextTree();
  if (!nextTreeHeight) return 0;
  let viewDistance = 0;
  while (nextTreeHeight !== undefined) {
    viewDistance++;
    if (startTreeHeight <= nextTreeHeight) {
      return viewDistance;
    }
    nextTreeHeight = getNextTree();
  }
  return viewDistance;
};
const getNextTreeInRow = ({ row, startCol, increment, treeGrid }) => {
  let currentCol = startCol;
  return () => {
    const col = currentCol;
    currentCol += increment;
    const treeGridElement = treeGrid[row];
    if (!treeGridElement) return undefined;
    return treeGridElement[col];
  };
};
const getNextTreeInCol = ({ col, startRow, increment, treeGrid }) => {
  let currentRow = startRow;
  return () => {
    const row = currentRow;
    currentRow += increment;
    const treeGridElement = treeGrid[row];
    if (!treeGridElement) return undefined;
    return treeGrid[row][col];
  };
};
const getScenicScoreOfTree = ({ treeGrid, row, col }) => {
  if (row === 0 || col === 0) return 0;
  const leftView = checkDirection({
    getNextTree: getNextTreeInRow({
      row,
      startCol: col,
      increment: -1,
      treeGrid,
    }),
  });
  const rightView = checkDirection({
    getNextTree: getNextTreeInRow({
      row,
      startCol: col,
      increment: 1,
      treeGrid,
    }),
  });
  const downView = checkDirection({
    getNextTree: getNextTreeInCol({
      col,
      startRow: row,
      increment: 1,
      treeGrid,
    }),
  });
  const upView = checkDirection({
    getNextTree: getNextTreeInCol({
      col,
      startRow: row,
      increment: -1,
      treeGrid,
    }),
  });
  return upView * downView * leftView * rightView;
};
const part2 = (filename, debug = false) => {
  const treeGrid = parseFile(filename, debug);
  const scenicScores = treeGrid.map((r, row) =>
    r.map((c, col) => getScenicScoreOfTree({ treeGrid, row, col }))
  );
  const data = scenicScores
    .flatMap((a) => a)
    .reduce((a, b) => (a > b ? a : b), 0);
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
  correctSampleAnswer: 21,
  correctInputAnswer: 1719,
});
runPart({
  part: part2,
  correctSampleAnswer: 8,
  correctInputAnswer: 590824,
});
