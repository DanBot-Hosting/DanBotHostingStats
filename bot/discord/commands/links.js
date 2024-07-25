const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const LinksEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .addField("Website", "[danbot.host](https://danbot.host)", true)
        .addField("Panel", "[panel.danbot.host](https://panel.danbot.host)", true)
        .addField("Service Status", "[service.danbot.host](https://service.danbot.host)", true)
        .addField("Uptime Site", "[uptime.danbot.host](https://uptime.danbot.host)", true)
        .addField("Portal", "[danbot.app](https://danbot.app)", true);

    return message.reply(LinksEmbed);
};
