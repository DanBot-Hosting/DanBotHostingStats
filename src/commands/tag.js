const Discord = require("discord.js");

const Config = require('../../config.json');
const MiscConfigs = require('../../config/misc-configs.js');

exports.description = "Wyświetla tagi, których użytkownicy mogą używać odpowiadając na pytania FAQ.";

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
        .setDescription(`Musisz podać prawidłowy tag.`)
        .setFooter(Config.DiscordBot.Prefix + "tag <tag>");

    if (!args[0]) {
        await message.reply(helpEmbed);
        return;
    }

    const embed = new Discord.MessageEmbed();

    switch (args[0].toLowerCase()) {
        case "command":
        case "commands":
            embed.setDescription(
                "Hej! Komend możesz używać tylko i wyłącznie na <#" + MiscConfigs.normalCommands + ">, <#" + MiscConfigs.donatorCommands + "> lub <#" + MiscConfigs.betaCommands + ">",
            );
            break;
        case "504":
            embed.setDescription(
                "`Błąd 504` oznacza, że systemy są obecnie wyłączone. Nie możesz nic z tym zrobić.\nProszę być cierpliwym oraz poczekać, aż Smutex to naprawi.",
            );
            break;

        default:
            return message.reply(helpEmbed.setDescription("**Nie mogę znaleźć tego tagu.**"));
    }

    embed.setFooter(`Wywołane przez: ${message.author.tag}`);

    message.delete();
    return message.channel.send(embed);
};