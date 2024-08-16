const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Wprowadza węzeł w tryb konserwacji.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Sprawdza, czy użytkownik ma rolę Administratora Systemu Bota.
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.BotAdmin)) return;

    if (!args[1]) {
        return message.reply("Proszę podać węzeł, który ma zostać wprowadzony w tryb konserwacji!");
    } else {
        const Data = nodeStatus.get(args[1].toLowerCase());

        if (Data == null) {
            return message.reply("Podano nieprawidłowy węzeł. Proszę podać prawidłową nazwę węzła DB.");
        } else {
            if (Data.maintenance) {
                const Result = await nodeStatus.set(`${args[1]}.maintenance`, false);

                if (!Result)
                    return message.reply(`Nie udało się wyłączyć trybu konserwacji dla ${args[1]}.`);

                message.reply(`Pomyślnie wyłączono tryb konserwacji dla ${args[1]}.`);
            } else if (Data.maintenance == false) {
                const Result = await nodeStatus.set(`${args[1]}.maintenance`, true);

                if (!Result)
                    return message.reply(`Nie udało się włączyć trybu konserwacji dla ${args[1]}.`);

                message.reply(`Pomyślnie włączono tryb konserwacji dla ${args[1]}.`);
            }
        }
    }
};