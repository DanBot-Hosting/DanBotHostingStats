const Discord = require('discord.js');

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
    message.reply("You have unlinked this account!");
};

exports.description = "Unlinks your account from a panel account.";