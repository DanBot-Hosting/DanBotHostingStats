const Discord = require("discord.js");
const humanizeDuration = require("humanize-duration");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Drop a premium key.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    const ms = require("ms");

    if (
        !MiscConfigs.codeDrops.includes(
            message.author.id,
        )
    )
        return;
    message.delete();

    if (args[1] == null) {
        message.reply("ayo fam, you need to specify a time.");
        return;
    }

    const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var codeGen = () => {
        var password = "";
        while (password.length < 16) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    const time = ms(args[1]) || 300000;

    let code;

    let moment = Date.now();

    if (!args[2]) {
        const random = codeGen();

        code = codes.set(random, {
            code: random,
            createdBy: message.author.id,
            balance: 1,
            createdAt: moment + time,
        });
    } else {
        code = codes.get(args[2]);
        if (code == null) {
            message.reply("That's not a code you scammer");
            return;
        }
    }

    const embed = new Discord.MessageEmbed()
        .setAuthor("Key Drop!")
        .setColor("BLUE")
        .setFooter(`Keydrop by ${message.author.username}`, bot.user.avatarURL)
        .setDescription(
            "Dropping a premium key in: " +
                humanizeDuration(time, {
                    round: true,
                }) +
                "!",
        )
        .setTimestamp(moment + time);

    let msg = await message.reply("", {
        embed: embed.setDescription(
            "Dropping a premium key in: " +
                humanizeDuration(time, {
                    round: true,
                }) +
                "!",
        ),
    });

    codes.set(code.code + ".drop", {
        message: {
            ID: msg.id,
            channel: msg.channel.id,
        },
    });

    setTimeout(() => {
        msg.edit(
            embed.setDescription(
                "Dropping a premium key in: " +
                    humanizeDuration(time - time / 1.2, {
                        round: true,
                    }) +
                    "!",
            ),
        );
    }, time / 1.2);

    setTimeout(() => {
        msg.edit(
            embed.setDescription(
                "Dropping a premium key in: " +
                    humanizeDuration(time / 2, {
                        round: true,
                    }) +
                    "!",
            ),
        );
    }, time / 2);

    setTimeout(() => {
        msg.edit(
            embed.setDescription(
                `**REDEEM NOW!**\nThe code is: \`${code.code}\` \n**Steps:** \n- Navigate to <#` + MiscConfigs.normalCommands + `>\n- Redeem the Premium Code: \`` + Config.DiscordBot.Prefix +`server redeem <CODE>\`\n\n*No one has redeemed the code yet!*`,
            ),
        );
    }, time);
};
