/**
 * 
 * @param {String} str
 * @param {BigInteger} length 
 * @returns 
 */

module.exports = function (str, length) {
    if(str == null || str?.length <= length) return str;

    return str.substr(0, length) + "**\u2026**";
}