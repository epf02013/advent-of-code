const { tally } = require("./array");
const countLetters = (line) => tally(line.split(""));

const uniqueLetters = (str) => Object.keys(countLetters(str));

module.exports = {
  countLetters,
  uniqueLetters,
};
