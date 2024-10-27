/**
 * Generates a random 10 digit number.
 *
 * @returns {string}
 */

module.exports = function () {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};
