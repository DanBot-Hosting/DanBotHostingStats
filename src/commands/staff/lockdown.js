const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Komenda do zablokowania serwera. Zarezerwowana dla Administratorów.";

/**
 * Komenda do zablokowania serwera. Zarezerwowana dla Administratorów, Współwłaścicieli i Właścicieli.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    // Jeśli użytkownik nie jest Właścicielem, Współwłaścicielem lub Administratorem, zwraca.
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

    // Jeśli nie podano argumentów, blokuje obecny kanał.
    if (!args[1]) {
        message.reply(
            "Kanał jest teraz zablokowany. Tylko Administratorzy i wyżej mogą tutaj pisać. \n\n`" + Config.DiscordBot.Prefix + "staff lockdown unlock` aby odblokować ten kanał.",
        );

        // Wyłącza możliwość wysyłania wiadomości dla wszystkich na tym kanale.
        message.channel.updateOverwrite(Config.DiscordBot.MainGuildId, {
            SEND_MESSAGES: false,
        });

        // Jeśli drugi argument to unlock, odblokowuje obecny kanał.
    } else if (args[1].toLowerCase() === "unlock") {
        message.reply("Kanał jest teraz odblokowany. Teraz wszyscy mogą wysyłać wiadomości!");

        // Włącza możliwość wysyłania wiadomości dla wszystkich na tym kanale.
        message.channel.updateOverwrite(Config.DiscordBot.MainGuildId, {
            SEND_MESSAGES: null,
        });
    }
};