const Discord = require("discord.js");
const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Staff Changelog command. Sends a message to the changelog channel.";

/**
 * Staff Changelog command. Sends a message to the changelog channel.
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Checks if the user has the Developer Role.
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Developer)) return;

    if (!args[1]) return message.reply("Please provide a message!");

    const msg = message.content.split(" ").slice(2).join(" ");

    const embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor(
            {
                name: message.author.tag.endsWith("#0") ? message.author.username : message.author.tag,
                iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true }),
                url: `https://discord.com/users/${message.author.id}`,
            }
        )
        .setDescription(msg)
        .setTimestamp()
        .setFooter(
            {
                text: `${client.user.username}`,
                iconURL: client.user.displayAvatarURL({ format: "png", dynamic: true }),
            }
        );
    
    const channel = await client.channels.cache.get(MiscConfigs.changelogs);
    await channel.send({content: `<@&${Config.DiscordBot.Roles.Changelogs}>`, embeds: [embed]});
    message.reply("Changelog sent!");
};
