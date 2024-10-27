const Discord = require("discord.js");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  const links = [
    { name: "Website", url: "https://danbot.host" },
    { name: "Panel", url: "https://panel.danbot.host" },
    { name: "Service Status", url: "https://service.danbot.host" },
    { name: "Uptime Site", url: "https://uptime.danbot.host" },
    { name: "Docs Site", url: "https://docs.danbot.host" },
  ];

  const LinksEmbed = new Discord.EmbedBuilder().setColor("Blue").addFields(
    links.map((link) => ({
      name: link.name,
      value: `[${link.url.replace(/https?:\/\//, "")}](${link.url})`,
      inline: true,
    }))
  );

  const rows = [];
  for (let i = 0; i < links.length; i += 3) {
    rows.push(
      new Discord.ActionRowBuilder().addComponents(
        links
          .slice(i, i + 3)
          .map((link) =>
            new Discord.ButtonBuilder()
              .setLabel(link.name)
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(link.url)
          )
      )
    );
  }

  return message.reply({ embeds: [LinksEmbed], components: rows });
};

exports.description = "Show links to DanBot Hosting services.";
