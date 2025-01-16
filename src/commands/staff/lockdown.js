const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Server lockdown command. Locked to Administator(s), Co Owner(s), and Owner(s).";

/**
 * Server lockdown command. Locked to Administator(s), Co Owner(s), and Owner(s).
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    //If user is not a Owner, CoOwner, or Admin, returns.
    if (
        !message.member.roles.cache.find((Role) =>
            [
                Config.DiscordBot.Roles.Owner,
                Config.DiscordBot.Roles.CoOwner,
                Config.DiscordBot.Roles.Admin,
            ].some((List) => List == Role.id),
        )
    )
        return;

    //If no arguments are provided, locks the current channel.
    if (!args[1]) {
        await message.reply(
            "Channel is now locked. Only Administrator+ can post here. \n\n`" + Config.DiscordBot.Prefix + "staff lockdown unlock` to unlock this channel.",
        );

        //Disabled sending messages for everyone in this channel.
        await message.channel.permissionOverwrites.set([
            {
                id: Config.DiscordBot.MainGuildId,
                deny: [Discord.PermissionFlagsBits.SendMessages]
            }
        ], 'Lockdown command.');

        //If the second argument is unlock, unlocks the current channel.
    } else if (args[1].toLowerCase() === "unlock") {
        await message.reply("Channel is now unlocked. Everyone can now send messages here again!");

        //Enables sending messages for everyone in this channel.
        await message.channel.permissionOverwrites.set([
            {
                id: Config.DiscordBot.MainGuildId,
                allow: [Discord.PermissionFlagsBits.SendMessages]
            }
        ], 'Lockdown command.');
    }
};
