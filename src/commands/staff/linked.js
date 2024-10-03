const Discord = require("discord.js");
const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.roleRequirement = Config.DiscordBot.Roles.BotAdmin;
exports.description = "Shows if an account is linked.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (MiscConfigs.botCommands.includes(message.author.id)) return;

    if (args[1] == null) {
        await message.reply(
            "Please send a users discord ID to see if they are linked with an account on the host.",
        );
    } else {
        if (userData.get(args[1]) == null) {
            await message.reply("That account is not linked with a console account.");
        } else {
            const Embed = new Discord.EmbedBuilder()
                .setColor(`Green`)
                .addFields(
                    { name: "__**Username**__", value: userData.fetch(args[1] + ".username"), inline: false },
                    { name: "__**Email**__", value: userData.fetch(args[1] + ".email"), inline: false },
                    { name: "__**Discord ID**__", value: userData.fetch(args[1] + ".discordID").toString(), inline: false },
                    { name: "__**Console ID**__", value: userData.fetch(args[1] + ".consoleID").toString(), inline: false },
                    { name: "__**Date (YYYY/MM/DD)**__", value: userData.fetch(args[1] + ".linkDate"), inline: false },
                    { name: "__**Time**__", value: userData.fetch(args[1] + ".linkTime"), inline: false },
                )
                .setTimestamp()
                .setFooter({ text: client.user.displayName, iconURL: client.user.avatarURL() });

            await message.reply({content: "That account is linked. Heres some data: ", embeds: [Embed]});
        }
    }
};
