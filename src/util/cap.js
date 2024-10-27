/**
 *
 * @param {String} str
 * @param {BigInteger} length
 * @returns
 */

module.exports = function (str, length) {
  if (!str || str.length <= length) return str;

  return str.substr(0, length) + "**\u2026**";
};
