const axios = require("axios");
const Discord = require("discord.js");

const Config = require('../../../config.json');

exports.description = "Wyświetla serwery, które ma użytkownik.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let user = message.author;
    let userID = message.author.id;

    // Zezwól adminom bota na przeglądanie serwerów innych użytkowników.
    if (message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.BotAdmin))
        userID = args[1] || message.author.id;

    const userAccount = userData.get(userID);

    if (userAccount == null || userAccount.consoleID == null) {
        if (userID === message.author.id) {
            return message.reply(
                `Nie masz powiązanego konta panelu, proszę utworzyć lub powiązać konto.\n\`${Config.DiscordBot.Prefix}user new\` - Utwórz konto\n\`${Config.DiscordBot.Prefix}user link\` - Powiąż konto`,
            );
        } else {
            return message.reply("Ten użytkownik nie ma powiązanego konta panelu.");
        }
    }

    if (userID !== message.author.id) {
        user = client.users.cache.get(userID);
    }

    // Lista serwerów
    var arr = [];

    axios({
        url: `${Config.Pterodactyl.hosturl}/api/application/users/${userAccount.consoleID}?include=servers`,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
    })
        .then((response) => {
            const preoutput = response.data.attributes.relationships.servers.data;
            arr.push(...preoutput);

            const format = (server) => {
                return arr.length > 20
                    ? `\`${server.attributes.identifier}\``
                    : `**${server.attributes.name}** (ID: \`${server.attributes.identifier}\`)`;
            };

            const freeServers = arr
                .filter((server) => !Config.DonatorNodes.includes(server.attributes.node))
                .map(format);
            const donoServers = arr
                .filter((server) => Config.DonatorNodes.includes(server.attributes.node))
                .map(format);

            if (arr.length == 0) {
                message.reply(
                    `${userID === message.author.id ? "Nie masz" : "Ten użytkownik nie ma"} żadnych serwerów.`,
                );
            } else if (arr.length > 70) {
                message.reply(
                    `${userID === message.author.id ? "Masz" : "Ten użytkownik ma"} zbyt wiele serwerów do wyświetlenia!`,
                );
            } else if (freeServers.length + donoServers.length > 20) {
                const serverListEmbed = new Discord.MessageEmbed().setTitle(
                    `Lista serwerów (${arr.length})`,
                );

                if (userID !== message.author.id)
                    serverListEmbed.setAuthor(
                        user.tag,
                        user.displayAvatarURL({ format: "png", dynamic: true }),
                        `https://discord.com/users/${user.id}`,
                    );
                if (freeServers.length > 0)
                    serverListEmbed.addField(
                        `:free: Darmowe (${freeServers.length})`,
                        freeServers.join(", "),
                    );
                if (donoServers.length > 0)
                    serverListEmbed.addField(
                        `:money_with_wings: Premium (${donoServers.length})`,
                        donoServers.join(", "),
                    );

                message.reply(serverListEmbed);
            } else {
                const serverListEmbed = new Discord.MessageEmbed().setTitle(
                    `Lista serwerów (${arr.length})`,
                );

                if (userID !== message.author.id)
                    serverListEmbed.setAuthor(
                        user.tag,
                        user.displayAvatarURL({ format: "png", dynamic: true }),
                        `https://discord.com/users/${user.id}`,
                    );
                if (freeServers.length > 0)
                    serverListEmbed.addField(
                        `:free: Darmowe (${freeServers.length})`,
                        freeServers.join("\n"),
                    );
                if (donoServers.length > 0)
                    serverListEmbed.addField(
                        `:money_with_wings: Premium (${donoServers.length})`,
                        donoServers.join("\n"),
                    );

                message.reply(serverListEmbed);
            }
        })
        .catch(() => message.reply("Wystąpił błąd podczas ładowania serwerów."));
};