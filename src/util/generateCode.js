/**
 * Generates a random 10 digit number.
 * 
 * @returns {Integer}
 */

module.exports = function () {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};