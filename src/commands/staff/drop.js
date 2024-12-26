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
        message.reply("You need to specify a time.");
        return;
    }
    
    await message.delete();

    // Manual time parsing function
    const parseTime = (timeStr) => {
        const timeValue = parseInt(timeStr.slice(0, -1));
        const timeUnit = timeStr.slice(-1).toLowerCase();
        
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
                multiplier = 60000; // default to minutes if no valid unit is provided
                break;
        }

        return timeValue * multiplier;
    };

    const time = parseTime(args[1]) || 300000; // Default to 5 minutes if parsing fails

    let code;

    const moment = Date.now();
    const epochInSeconds = Math.floor(Date.now() / 1000) + (time / 1000);

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
