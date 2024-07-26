module.exports = function () {
    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    var password = "";

    // Creating a 16 character password using the CAPSNUM string.
    while (password.length < 16) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }

    return password;
};
