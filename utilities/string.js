const { tally } = require("./array");
const countLetters = (line) => tally(line.split(""));

const uniqueLetters = (str) => Object.keys(countLetters(str));
const getAllNumbers = (str) => {
  const digitsOrNull = str.match(/(\d+)/g);
  if (!digitsOrNull) throw "there were no numbers in the string:" + str;
  return digitsOrNull.map((s) => parseInt(s));
};
module.exports = {
  countLetters,
  uniqueLetters,
  getAllNumbers,
};
