const Discord = require("discord.js");
const Config = require('../../../config.json');

/**
 * Staff Changelog command. Sends a message to the changelog channel.
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = (client, message, args) => {
    // Check if user has the dev role
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Developer)) return;

    if (!args[1]) return message.reply("Please provide a message!");

    const msg = message.content.split(" ").slice(2).join(" ");

    const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(
            message.author.tag.endsWith("#0") ? message.author.username : message.author.tag,
            message.author.displayAvatarURL({ format: "png", dynamic: true }),
            `https://discord.com/users/${message.author.id}`,
        )
        .setDescription(msg)
        .setTimestamp();
    const channel = client.channels.cache.get("960242064338092202");
    channel.send("<@&898041779696312320>", embed);
    message.reply("Changelog sent!");
};
