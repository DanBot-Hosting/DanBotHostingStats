const Discord = require("discord.js");
const Config = require("../../config.json");
const tags = require("../../config/tags.js");

exports.description = "Displays tags for the users to use in FAQ questions.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  const HelpEmbed = new Discord.EmbedBuilder()
    .setColor("Red")
    .setFooter({ text: Config.DiscordBot.Prefix + "tag <tag>" });

  if (!args[0]) {
    HelpEmbed.setDescription(
      `You need to provide a valid tag. Available tags: ${Object.keys(
        tags
      ).join(", ")}`
    );
    await message.reply({ embeds: [HelpEmbed] });
    return;
  }

  const tagKey = args[0].toLowerCase();
  let tagDescription = null;

  for (const [key, value] of Object.entries(tags)) {
    if (tagKey.includes(key)) {
      tagDescription = value;
      break;
    }
  }

  if (!tagDescription) {
    HelpEmbed.setDescription("**I could not find this tag.**");
    await message.reply({ embeds: [HelpEmbed] });
    return;
  }

  const Embed = new Discord.EmbedBuilder()
    .setDescription(tagDescription)
    .setFooter({
      text: `Requested by ${message.author.globalName} (${message.author.username})`,
    })
    .setColor("Blurple")
    .setTimestamp();

  await message.delete();
  await message.channel.send({ embeds: [Embed] });
};
