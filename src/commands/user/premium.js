const Discord = require("discord.js");
const parser = new Intl.NumberFormat();

const Config = require("../../../config.json");

exports.description =
  "Shows the number of premium servers you have, and how many you have used.";

/**
 * User premium command. Shows the user the number of premium servers they have, and how many they have used.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  const userId = args[1]?.match(/[0-9]{17,19}/)?.[0] || message.author.id;

  // Gets the user's premium data.
  let userPremium = (await userPrem.get(userId)) || {};

  // Takes amount donated and divides by the price of a premium server to determine max count.
  const maxAmount = Math.floor(
    (userPremium.donated || 0) / Config.PremiumServerPrice
  );

  const Embed = new Discord.EmbedBuilder()
    .setColor("Blue")
    .addFields(
      {
        name: "Premium servers used:",
        value: `${userPremium.used || 0} out of ${parser.format(
          maxAmount
        )} servers used.`,
        inline: false,
      },
      {
        name: "Amount Donated:",
        value: `$${parser.format(userPremium.donated || 0)}.00`,
        inline: false,
      }
    )
    .setTimestamp()
    .setFooter({
      text: `Requested by ${message.author.username}`,
      iconURL: message.author.avatarURL(),
    });

  await message.reply({ embeds: [Embed] });
};
