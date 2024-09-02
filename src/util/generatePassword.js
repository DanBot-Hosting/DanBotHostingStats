/**
 * Generates a random 16 character password.
 * 
 * @returns {String}
 */

module.exports = function () {
    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let password = "";

    for (let i = 0; i < 16; i++) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }

    return password;
};