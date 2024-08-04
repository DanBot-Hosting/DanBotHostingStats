const Discord = require("discord.js");

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
        .setFooter("DBH!tag <tag>");

    if (!args[0]) {
        await message.reply(helpEmbed);
        return;
    }

    const embed = new Discord.MessageEmbed();

    switch (args[0].toLowerCase()) {
        case "command":
        case "commands":
            embed.setDescription(
                "Hey! Please only run your commands in <#898041850890440725>, <#898041866589700128> or <#898041878447013948>",
            );
            break;
        case "504":
            embed.setDescription(
                "`Error 504` means that the wings are currently down. This is nothing you can change.\nPlease be patient and wait for Dan to fix it.",
            );
            break;
        case "api":
        case "dbh-api":
            embed.setDescription(
                "You can find API-Wrappers and there documentation here:\n[Python](https://pypi.org/project/danbot-hosting/)\nSupport for more languages is comming soon.",
            );
            break;

        default:
            return message.reply(helpEmbed.setDescription("**I could not find this tag.**"));
    }

    embed.setFooter(`Requested by ${message.author.tag}`);

    message.delete();
    return message.channel.send(embed);
};

exports.description = "Displays tags for the users to use in FAQ questions.";