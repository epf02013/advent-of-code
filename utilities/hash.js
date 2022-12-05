const findKeyForValue = (desiredValue) => (hash) =>
  Object.entries(hash).find(([_, count]) => count === desiredValue)[0];

module.exports = {
  findKeyForValue,
};
