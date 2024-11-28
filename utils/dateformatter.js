// Format date to '12 Nov 2024' format
const formatDate = () => {
  const date = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};
// Export the functions
module.exports = {
  formatDate,
};
