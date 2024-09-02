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

    const embed = new Discord.EmbedBuilder()
        .addFields(
            { name: ":white_check_mark: Uptime:", value: `**${humanizeDuration(client.uptime, { round: true })}**`, inline: true },
            { name: "Memory usage:", value: `${Math.trunc(process.memoryUsage().heapUsed / 1024 / 1000)}mb`, inline: true },
            { name: "API latency:", value: `${client.ws.ping}ms`, inline: true }
        )
        .setFooter({text: `Ready Timestamp: ${myDate.toString()}`})
        .setColor("Green");

    message.reply({ embeds: [embed] });
};