const Discord = require("discord.js");
const parser = new Intl.NumberFormat();

const Config = require('../../../config.json');

/**
 * User premium command. Shows the user the number of premium servers they have, and how many they have used.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    const userId =
        args[1] == null
            ? message.author.id
            : args[1].match(/[0-9]{17,19}/).length == 0
              ? args[1]
              : args[1].match(/[0-9]{17,19}/)[0];

    //Gets the user's premium data.
    const userPremium = userPrem.fetch(userId);

    //If the user has no premium data, set it to an empty object.
    if (userPremium == null) userPremium = {};

    //Takes amount donated and divides by the price of a premium server to determine max count.
    const maxAmount = Math.floor((userPremium.donated || 0) / Config.PremiumServerPrice);

    const Embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .addField(
            "Premium servers used:",
            (userPremium.used || 0) + " out of " + parser.format(maxAmount) + " servers used.",
        )
        .addField("Amount Donated:", `$${parser.format(userPremium.donated || 0)}.00`, true);

    await message.reply(Embed);
};

exports.description = "Shows the number of premium servers you have, and how many you have used.";
