const Discord = require("discord.js");

const Config = require('../../config.json');
const MiscConfigs = require('../../config/misc-configs.js');

exports.description = "Displays tags for the users to use in FAQ questions.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`You need to provide a valid tag.`)
        .setFooter(Config.Discord.Prefix + "tag <tag>");

    if (!args[0]) {
        await message.reply(helpEmbed);
        return;
    }

    const embed = new Discord.MessageEmbed();

    switch (args[0].toLowerCase()) {
        case "command":
        case "commands":
            embed.setDescription(
                "Hey! Please only run your commands in <#" + MiscConfigs.normalCommands + ">, <#" + MiscConfigs.donatorCommands + "> or <#" + MiscConfigs.betaCommands + ">",
            );
            break;
        case "504":
            embed.setDescription(
                "`Error 504` means that the wings are currently down. This is nothing you can change.\nPlease be patient and wait for Dan to fix it.",
            );
            break;

        default:
            return message.reply(helpEmbed.setDescription("**I could not find this tag.**"));
    }

    embed.setFooter(`Requested by ${message.author.tag}`);

    message.delete();
    return message.channel.send(embed);
};