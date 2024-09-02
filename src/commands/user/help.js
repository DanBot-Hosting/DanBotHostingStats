const Discord = require("discord.js");
const fs = require("fs");
const Config = require('../../../config.json');

exports.description = "Shows the user commands under this category.";

/**
 * User help command. Shows the user the commands under this category.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    const Embed = new Discord.EmbedBuilder();
    Embed.setColor("Blue");
    Embed.setTitle("User Commands");

    fs.readdirSync(__dirname).forEach((File) => {
        Embed.addFields({
            name: "`" + Config.DiscordBot.Prefix + "user " + File.split(".")[0] + "`",
            value: require("./" + File).description
        });
    });

    await message.reply({embeds: [Embed]});
};