const tally = (arr) =>
  arr.reduce((acc, curr) => {
    const res = { ...acc };
    if (res[curr]) {
      res[curr] += 1;
    } else {
      res[curr] = 1;
    }
    return res;
  }, {});
const merge = (arr) => [].concat(...arr);
const chunk = (chunkSize) => (arr) => {
  const res = [];
  for (let index = 0; index < arr.length; ) {
    const chunk = [];
    while (chunk.length < chunkSize && index < arr.length) {
      chunk.push(arr[index]);
      index++;
    }
    res.push(chunk);
  }
  return res;
};
module.exports = {
  tally,
  merge,
  chunk,
};
