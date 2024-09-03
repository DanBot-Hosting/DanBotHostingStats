const Discord = require('discord.js');
const fs = require('fs');

const Config = require('../../../config.json');

exports.description = "Shows staff commands.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    const Embed = new Discord.EmbedBuilder();
    Embed.setColor("Blue");
    Embed.setTitle("Staff Commands");

    fs.readdirSync(__dirname).forEach(File => {

        Embed.addFields({
            name: "`" + Config.DiscordBot.Prefix + "staff " + File.split(".")[0] + "`",
            value: require("./" + File).description
        });
    });

    message.reply({ embeds: [Embed]});
};
