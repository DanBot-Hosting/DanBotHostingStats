const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    const LinksEmbed = new Discord.EmbedBuilder()
        .setColor("Blue")

        .addFields(
            {name: "Website", value: "[danbot.host](https://danbot.host)", inline: true},
            {name: "Panel", value: "[panel.danbot.host](https://panel.danbot.host)", inline: true},
            {name: "Service Status", value: "[service.danbot.host](https://service.danbot.host)", inline: true},
            {name: "Uptime Site", value: "[uptime.danbot.host](https://uptime.danbot.host)", inline: true},
            {name: "Docs Site", value: "[docs.danbot.host](https://docs.danbot.host)", inline: true},
            {name: "Billing Site", value: "[billing.danbot.host](https://billing.danbot.host)", inline: true}
        )

    return message.reply({embeds: [LinksEmbed]});
};

exports.description = "Show links to DanBot Hosting services.";
