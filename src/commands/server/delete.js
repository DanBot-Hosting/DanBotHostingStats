const Discord = require("discord.js");
const axios = require("axios");

const Config = require('../../../config.json');

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    // Pobierz identyfikatory serwerów z argumentów komendy
    const serverIds = args
        .slice(1)
        .map((id) =>
            id.replace(`${Config.Pterodactyl.hosturl}/server/`, "").match(/[0-9a-z]+/i)?.[0]
        )
        .filter(Boolean);

    if (serverIds.length === 0) {
        await message.reply(
            `Format komendy: \`${Config.DiscordBot.Prefix}server delete <SERVER_ID_1> <SERVER_ID_2> ...\``
        );
        return;
    }

    const msg = await message.reply("Sprawdzam serwery...");

    try {
        // Pobierz serwery użytkownika z API Pterodactyla
        const response = await axios({
            url: `${Config.Pterodactyl.hosturl}/api/application/users/${userData.get(
                message.author.id
            ).consoleID}?include=servers`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        });

        const userServers = response.data.attributes.relationships.servers.data;

        // Filtruj serwery, które są ważne i są własnością użytkownika
        const serversToDelete = userServers.filter(
            (server) =>
                serverIds.includes(server.attributes?.identifier) &&
                server.attributes.user === userData.get(message.author.id).consoleID
        );

        if (serversToDelete.length === 0) {
            msg.edit("Nie znaleziono ważnych lub posiadanych serwerów do usunięcia.");
            return;
        }

        // Skonstruuj listę nazw serwerów
        const serverNames = serversToDelete
            .map((server) => server.attributes.name.split("@").join("@​"))
            .join(", ");

        // Potwierdzenie (używając odpowiedzi dla lepszej obsługi użytkownika)
        const confirmMsg = await message.reply(
            `Usunąć te serwery: ${serverNames}?\nNapisz \`confirm\` w ciągu 1 minuty.`
        );

        try {
            // Oczekiwanie na wiadomość potwierdzającą (z bardziej solidnym filtrem)
            const confirmation = await message.channel.awaitMessages(
                (m) => m.author.id === message.author.id && m.content.toLowerCase() === 'confirm',
                { max: 1, time: 60000, errors: ['time'] }
            );

            if (confirmation.size === 0) {
                confirmMsg.edit("Żądanie anulowane lub czas minął.");
                return;
            }

            confirmMsg.delete();

            // Pętla usuwania (po pomyślnym potwierdzeniu)
            for (const server of serversToDelete) {
                await msg.edit(`Usuwam serwer ${server.attributes.name}...`);
                try {
                    // Usuń serwer z API Pterodactyla
                    await axios({
                        url: `${Config.Pterodactyl.hosturl}/api/application/servers/${server.attributes.id}/force`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                        },
                    }).then(() => {
                        msg.edit(`Serwer ${server.attributes.name} usunięty!`);

                        if (Config.DonatorNodes.find(x => x === server.attributes.node)) {
                            userPrem.set(
                                message.author.id + ".used",
                                userPrem.fetch(message.author.id).used - 1,
                            );
                        }
                    });
                } catch (deletionError) {
                    console.error(`Błąd podczas usuwania serwera ${server.attributes.name}:`, deletionError);
                    msg.edit(`Nie udało się usunąć serwera ${server.attributes.name}. Proszę spróbować ponownie później.`);
                }
            }
        } catch (err) {
            console.error("Błąd podczas potwierdzania:", err);
            confirmMsg.edit("Wystąpił błąd podczas potwierdzania.");
        }
    } catch (err) {
        console.error("Błąd podczas pobierania szczegółów serwera:", err);

        msg.edit(
            "Wystąpił błąd podczas pobierania szczegółów serwera. Proszę spróbować ponownie później."
        );
    }
};

exports.description = "Usuń wiele serwerów. Zobacz tę komendę, aby uzyskać instrukcje.";