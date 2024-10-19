const Discord = require("discord.js");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

const generatePassword = require('../../util/generatePassword.js');

exports.description = "Create a code for premium servers.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Make sure the user has the correct permissiosn.
    if (
        !MiscConfigs.codeDrops.includes(
            message.author.id,
        )
    ) return;

    if (args.length < 3) {
        message.reply(`Usage: \`${Config.DiscordBot.Prefix}staff code <name> <uses>\``);
        return;
    }

    let balance = parseInt(args[2]);

    if (isNaN(balance)) {
        message.reply("Uses must be a valid number.");
        return;
    }

    const code = args[1].toLowerCase() == "random" ? generatePassword() : args[1];

    if (await codes.get(code) != null) {
        message.reply("A code with that name already exists.");
        return;
    }

    message.reply(
        "Created code: `" +
            code +
            "` with `" +
            args[2] +
            "` premium servers. \n\nRedeem this with `"+ Config.DiscordBot.Prefix + "server redeem " +
            code +
            "`",
    );

    await codes.set(code, {
        code: code,
        createdBy: message.author.id,
        balance: balance,
        createdAt: Date.now(),
    });
};
