const Discord = require("discord.js");

/**
 * User unlink command. Unlinks the user's account from a panel account.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    userData.delete(message.author.id);
    message.reply("Odlinkowano konto!");
};

exports.description = "Odlinkuj swoje konto z panelu.";