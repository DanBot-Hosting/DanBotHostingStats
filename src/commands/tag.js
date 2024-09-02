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

    const HelpEmbed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(`You need to provide a valid tag.`)
        .setFooter({text: Config.DiscordBot.Prefix + "tag <tag>"});

    if (!args[0]) {
        await message.reply({embeds: [HelpEmbed]});
        return;
    }

    const Embed = new Discord.EmbedBuilder();

    switch (args[0].toLowerCase()) {
        case "command":
        case "commands":
            Embed.setDescription(
                "Hey! Please only run your commands in <#" + MiscConfigs.normalCommands + ">, <#" + MiscConfigs.donatorCommands + "> or <#" + MiscConfigs.betaCommands + ">",
            );
            break;
        case "504":
            Embed.setDescription(
                "`Error 504` means that the wings are currently down. This is nothing you can change.\nPlease be patient and wait for Dan to fix it.",
            );
            break;

        default:
            HelpEmbed.setDescription("**I could not find this tag.**")
            return message.reply({embeds: [HelpEmbed]});
    }

    Embed.setFooter({text: `Requested by ${message.author.globalName} (${message.author.username})`});
    Embed.setColor("Blurple");
    Embed.setTimestamp();

    message.delete();
    return message.reply({embeds: [Embed]});
};