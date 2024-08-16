const Discord = require("discord.js");
const humanizeDuration = require("humanize-duration");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Wydaje klucz premium.";

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
        message.reply("Ej, musisz określić czas.");
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
            message.reply("To nie jest kod, oszuście");
            return;
        }
    }

    const embed = new Discord.MessageEmbed()
        .setAuthor("Wydanie klucza!")
        .setColor("BLUE")
        .setFooter(`Klucz wydany przez ${message.author.username}`, bot.user.avatarURL)
        .setDescription(
            "Wydanie klucza premium za: " +
            humanizeDuration(time, {
                round: true,
            }) +
            "!",
        )
        .setTimestamp(moment + time);

    let msg = await message.reply("", {
        embed: embed.setDescription(
            "Wydanie klucza premium za: " +
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
                "Wydanie klucza premium za: " +
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
                "Wydanie klucza premium za: " +
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
                `**ODEBRAĆ TERAZ!**\nKod to: \`${code.code}\` \n**Kroki:** \n- Przejdź do <#` + MiscConfigs.normalCommands + `>\n- Odbierz klucz premium: \`` + Config.DiscordBot.Prefix + `server redeem <CODE>\`\n\n*Nikt jeszcze nie odebrał kodu!*`,
            ),
        );
    }, time);
};