const Discord = require('discord.js');
const fs = require('fs');

const Config = require('../../../config.json');

exports.description = "Shows staff commands."

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    const Embed = new Discord.MessageEmbed();
    Embed.setColor("BLUE");
    Embed.setTitle("Staff Commands");

    fs.readdirSync(__dirname).forEach((File) => {
        Embed.addField("`" + Config.DiscordBot.Prefix + "user " + File.split(".")[0] + "`", require("./" + File).description);
    });

    await message.reply(Embed);
};
