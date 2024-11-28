// Generate a random number between 150 and 250
const randomIncrement = () => {
  return Math.floor(Math.random() * (250 - 150 + 1)) + 150;
};
// Export the functions
module.exports = {
  randomIncrement,
};