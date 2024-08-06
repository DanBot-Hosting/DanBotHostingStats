const Discord = require("discord.js");
const Config = require('../../../config.json');

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
                Configs.DiscordBot.Roles.Owner,
                Configs.DiscordBot.Roles.CoOwner,
                Configs.DiscordBot.Roles.Admin,
            ].some((List) => List == Role.id),
        )
    )
        return;

    //If no arguments are provided, locks the current channel.
    if (!args[1]) {
        message.reply(
            "Channel is now locked. Only Administrator+ can post here. \n\n`" + Config.DiscordBot.Prefix + "staff lockdown unlock` to unlock this channel.",
        );

        //Disabled sending messages for everyone in this channel.
        message.channel.updateOverwrite(Configs.DiscordBot.MainGuildId, {
            SEND_MESSAGES: false,
        });

        //If the second argument is unlock, unlocks the current channel.
    } else if (args[1].toLowerCase() === "unlock") {
        message.reply("Channel is now unlocked. Everyone can now send messages here again!");

        //Enables sending messages for everyone in this channel.
        message.channel.updateOverwrite(Configs.DiscordBot.MainGuildId, {
            SEND_MESSAGES: null,
        });
    }
};
