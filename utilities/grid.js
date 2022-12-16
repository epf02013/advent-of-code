const addPoints = (p1, p2) => {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
};
const gridNeighbours =
  (grid) =>
  (point, options = {}) => {
    return gridNeighboursWithBounds(
      {
        xMin: 0,
        xMax: grid[0].length - 1,
        yMin: 0,
        yMax: grid.length - 1,
      },
      point,
      options
    );
  };
const gridNeighboursWithBounds = (
  { xMin, xMax, yMin, yMax },
  point,
  options = {}
) => {
  const neighbours = [];
  const xMods = [0];
  if (point.x > xMin) xMods.push(-1);
  if (point.x < xMax) xMods.push(1);
  const yMods = [0];
  if (point.y > yMin) yMods.push(-1);
  if (point.y < yMax) yMods.push(1);
  for (const x of xMods) {
    for (const y of yMods) {
      if (!(x === 0 && y === 0)) {
        const isDiagonal = Math.abs(x) + Math.abs(y) === 2;
        if (options.onlyDiagonals && isDiagonal) {
          neighbours.push({ x, y });
        } else if (
          options.allowDiagonals ||
          (!isDiagonal && !options.onlyDiagonals)
        ) {
          neighbours.push({ x, y });
        }
      }
    }
  }
  return neighbours
    .map((n) => addPoints(n, point))
    .filter((p) => {
      return p.x <= xMax && p.x >= xMin && p.y <= yMax && p.y >= yMin;
    });
};
module.exports = {
  gridNeighbours,
  addPoints,
};
