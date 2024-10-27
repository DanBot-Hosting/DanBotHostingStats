const Discord = require("discord.js");

exports.description = "Shows the bot's uptime, memory usage and API latency.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */

exports.run = async (client, message, args) => {
  const uptime = client.uptime;
  const { days, hours, minutes, seconds } = getUptime(uptime);

  const embed = new Discord.EmbedBuilder()
    .setTitle("Bot Uptime")
    .setDescription(
      `**${days}** days, **${hours}** hours, **${minutes}** minutes, **${seconds}** seconds`
    )
    .addFields(
      {
        name: "Deployed At", // full date
        value: `<t:${Math.floor(client.readyAt / 1000)}:F>`,
        inline: false,
      },
      {
        name: "Running From", // x minutes/seconds
        value: `<t:${Math.floor(client.readyAt / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Memory usage:",
        value: `${Math.trunc(process.memoryUsage().heapUsed / 1024 / 1000)}mb`,
        inline: true,
      },
      { name: "API latency:", value: `${client.ws.ping}ms`, inline: true }
    )
    .setColor("Green")
    .setTimestamp();

  message.reply({ embeds: [embed] });
};

function getUptime(uptime) {
  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor(uptime / 3600000) % 24;
  const minutes = Math.floor(uptime / 60000) % 60;
  const seconds = Math.floor(uptime / 1000) % 60;
  return { days, hours, minutes, seconds };
}
