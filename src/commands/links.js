const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    const LinksEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .addField("Strona WWW", "[dinohost.pl](https://dinohost.pl)", true)
        .addField("Panel klienta", "[panel.danbot.host](https://panel.dinohost.pl)", true)
        .addField("Status serwerów", "[status.dinohost.pl(https://dinohost.pl)", true);

    return message.reply(LinksEmbed);
};

exports.description = "Pokazuje przydatne linki naszego hostingu.";