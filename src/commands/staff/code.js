const Discord = require("discord.js");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Utwórz kod dla serwerów premium.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Upewnij się, że użytkownik ma odpowiednie uprawnienia.
    if (
        !MiscConfigs.codeDrops.includes(
            message.author.id,
        )
    )
        return;

    // Generuj losowy kod.
    const CAPSNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var codeGen = () => {
        var password = "";
        while (password.length < 16) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    if (args.length < 3) {
        message.reply(`Użycie: \`${Config.DiscordBot.Prefix}staff code <nazwa> <ilość>\``);
        return;
    }

    let balance = parseInt(args[2]);

    if (isNaN(balance)) {
        message.reply("Ilość musi być prawidłową liczbą.");
        return;
    }

    const code = args[1].toLowerCase() == "random" ? codeGen() : args[1];

    if (codes.get(code) != null) {
        message.reply("Kod o tej nazwie już istnieje.");
        return;
    }

    message.reply(
        "Utworzono kod: `" +
        code +
        "` z `" +
        args[2] +
        "` serwerami premium. \n\nOdbierz ten kod, używając `" + Config.DiscordBot.Prefix + " server redeem " +
        code +
        "`",
    );

    codes.set(code, {
        code: code,
        createdBy: message.author.id,
        balance: balance,
        createdAt: Date.now(),
    });
};