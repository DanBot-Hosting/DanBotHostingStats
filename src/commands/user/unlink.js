const Discord = require("discord.js");

exports.description = "Unlinks your account from a panel account.";

/**
 * User unlink command. Unlinks the user's account from a panel account.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    await userData.delete(message.author.id);
    message.reply("You have unlinked this account!");
};