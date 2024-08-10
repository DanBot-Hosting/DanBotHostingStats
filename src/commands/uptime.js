const Discord = require("discord.js");
const humanizeDuration = require("humanize-duration");

exports.description = "Shows the bot's uptime, memory usage and API latency.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const myDate = new Date(client.readyTimestamp);

    const Embed = new Discord.MessageEmbed()
        .addField(
            ":white_check_mark: Uptime:",
            `**${humanizeDuration(client.uptime, { round: true })}**`,
            true,
        )
        .addField(
            "Memory usage:",
            Math.trunc(process.memoryUsage().heapUsed / 1024 / 1000) + "mb",
            true,
        )
        .addField("API latency:", client.ws.ping + "ms", true)
        .setFooter(`Ready Timestamp: ${myDate.toString()}`)
        .setColor("GREEN");

    message.channel.send(Embed);
};