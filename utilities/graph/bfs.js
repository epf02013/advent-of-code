const { Queue } = require("../queue");
const bfs = ({ getNeighbours, start, end }) => {
  const queue = new Queue(start);
  const seen = { [start.key]: start };
  while (!queue.empty()) {
    const currentPoint = queue.pop();
    const neighbouringPoints = getNeighbours(currentPoint);
    for (const point of neighbouringPoints) {
      if (!seen[point.key]) {
        seen[point.key] = currentPoint;
        queue.push(point);
      }
    }
    if (seen[end.key]) {
      break;
    }
  }
  if (!seen[end.key]) {
    return undefined;
  }
  const pathToEndpoint = [end];
  let currentNode = end;
  while (currentNode.key !== start.key) {
    currentNode = seen[currentNode.key];
    pathToEndpoint.push(currentNode);
  }
  return pathToEndpoint.reverse();
};

module.exports = {
  bfs,
};
