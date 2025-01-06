const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Put a Node in maintenance.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    //Checks if the user has the Bot System Administrator Role.
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.BotAdmin)) return;

    if (!args[1]) {
        return await message.reply("Please provide a Node to put into maintenance!");
    } else {
        const Data = await nodeStatus.get(args[1].toLowerCase());

        if (Data == null) {
            return await message.reply("Invalid Node provided. Please provide a valid Node DB name.");
        } else {
            if (Data.maintenance) {
                const Result = await nodeStatus.set(`${args[1]}.maintenance`, false);

                if (!Result)
                    return message.reply(`Unable to put ${args[1]} out of maintenance mode.`);

                await message.reply(`Successfully put ${args[1]} out of maintenance mode.`);
            } else if (Data.maintenance == false) {
                const Result = await nodeStatus.set(`${args[1]}.maintenance`, true);

                if (!Result)
                    return message.reply(`Unable to put ${args[1]} into maintenance mode.`);

                await message.reply(`Successfully put ${args[1]} into maintenance mode.`);
            } else if (Data.maintenance == null) {
                const Result = await nodeStatus.set(`${args[1]}.maintenance`, false);

                if (!Result)
                    return message.reply(`Unable to put ${args[1]} out of maintenance mode (FIRST).`);

                await message.reply(`Successfully put ${args[1]} into maintenance mode (FIRST).`);
            }
        }
    }
};
