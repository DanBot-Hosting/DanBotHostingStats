const Discord = require("discord.js");


exports.description = "Pokazuje opóźnienie bota.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("Opóźnienie bota")
        .setDescription(
            `Opóźnienie: ${Date.now() - message.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`,
        )
        .setTimestamp();
    message.reply(embed);
};