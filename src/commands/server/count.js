const Discord = require("discord.js");
const Config = require("../../../config.json");
const getUserServers = require("../../util/getUserServers.js");

exports.description = "Shows the amount of servers a user has.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  let userId = args[1]?.match(/[0-9]{17,19}/)?.[0] || message.author.id; // The Discord User ID.
  const user = userData.get(userId);

  if (!user) {
    return message.channel.send("User does not have account linked.");
  }

  try {
    const response = await getUserServers(user.consoleID);
    const userServers = response.attributes.relationships.servers.data; // The user server data from the panel.
    const premiumServers = userServers.filter((server) =>
      Config.DonatorNodes.includes(server.attributes.node)
    ).length; // The amount of premium servers the user has.

    const serverCountEmbed = new Discord.EmbedBuilder()
      .setTitle("Server Count:")
      .setDescription(
        `
                :free: Free Server(s): ${
                  userServers.length - premiumServers
                }\n:money_with_wings: Premium Server(s): ${premiumServers}
            `
      )
      .setColor("Blurple")
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();

    message.reply({ embeds: [serverCountEmbed] });
  } catch (error) {
    message.reply("An error occurred while loading servers.");
  }
};
