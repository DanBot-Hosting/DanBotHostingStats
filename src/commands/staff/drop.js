const Discord = require("discord.js");
const humanizeDuration = require("humanize-duration");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

const generatePassword = require('../../util/generatePassword.js')

exports.description = "Drop a premium key.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (!MiscConfigs.codeDrops.includes(message.author.id)) {
        return;
    }

    if (args[1] == null) {
        message.reply("You need to specify a time (format: number + unit, e.g., 5m, 2h, 1d).");
        return;
    }

    // Manual time parsing function
    const parseTime = (timeStr) => {
        const timeRegex = /^(\d+)([dhms])$/i;
        const match = timeStr.match(timeRegex);

        if (!match) {
            throw new Error('Invalid time format. Use format: number + unit (e.g., 5m, 2h, 1d)');
        }

        const timeValue = parseInt(match[1]);
        const timeUnit = match[2].toLowerCase();

        if (timeValue <= 0) {
            throw new Error('Time value must be positive');
        }

        let multiplier;
        switch (timeUnit) {
            case 'd':
                multiplier = 86400000; // days to milliseconds
                break;
            case 'h':
                multiplier = 3600000; // hours to milliseconds
                break;
            case 'm':
                multiplier = 60000; // minutes to milliseconds
                break;
            case 's':
                multiplier = 1000; // seconds to milliseconds
                break;
            default:
                throw new Error('Invalid time unit. Use s, m, h, or d');
        }

        const totalMs = timeValue * multiplier;
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

        if (totalMs > oneWeekMs) {
            throw new Error('Time cannot exceed 1 week duration.');
        }

        return totalMs;
    };

    let time;
    try {
        time = parseTime(args[1]);
    } catch (error) {
        message.reply(error.message);
        return;
    }

    await message.delete();

    let code;

    const moment = Date.now();
    const epochInSeconds = Math.floor(Date.now() / 1000) + (time / 1000);

    // Add timestamp validation
    const maxTimestamp = 8640000000000000;
    if ((moment + time) > maxTimestamp) {
        message.reply("The specified time results in an invalid timestamp. Please use a shorter duration.");
        return;
    }

    if (!args[2]) {
        const random = generatePassword();

        code = await codes.set(random, {
            code: random,
            createdBy: message.author.id,
            balance: 1,
            createdAt: moment + time,
        });
    } else {
        code = await codes.set(args[2], {
            code: args[2],
            createdBy: message.author.id,
            balance: 1,
            createdAt: moment + time,
        });
    }

    const Embed = new Discord.EmbedBuilder()
        .setAuthor({ name: "Premium Key Drop!", iconURL: client.user.avatarURL() })
        .setColor("Blue")
        .setFooter({ text: `Keydrop by ${message.author.username}`, value: client.user.avatarURL(), iconURL: message.author.avatarURL() })
        .setDescription(
            "Dropping a premium key in: <t:" +
            epochInSeconds +
            ":R>!",
        )
        .setTimestamp(moment + time);

    const msg = await message.channel.send({ embeds: [Embed] });

    await codes.set(code.code + ".drop", {
        message: {
            ID: msg.id,
            channel: msg.channel.id,
        },
    });

    setTimeout(async () => {
        await msg.edit(
            {
                embeds: [Embed.setDescription(
                    `**REDEEM NOW!**\nThe code is: \`${code.code}\` \n**Steps:** \n- Navigate to <#${MiscConfigs.normalCommands}>\n- Redeem the Premium Code: \`${Config.DiscordBot.Prefix}server redeem <CODE>\`\n\n*No one has redeemed the code yet!*`,
                )]
            }
        ).catch(async (Error) => {});
    }, time);
};
