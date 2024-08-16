const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Poprawia liczbę serwerów premium użytkownika.";

/**
 * Komenda do naprawy liczby serwerów premium. Zablokowana dla personelu.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    if (!args[1]) {
        return message.reply("Proszę podać użytkownika!");
    } else {
        const replyMsg = await message.reply("Rozpoczynam obliczenia...");

        try {
            let selectedUser = client.users.cache.get(
                args[1].match(/\d{17,19}/).length == 0 ? args[1] : args[1].match(/\d{17,19}/)[0],
            );
            selectedUser = await selectedUser;

            const userAccount = userData.get(selectedUser.id);

            if (userAccount == null || userAccount.consoleID == null) {
                if (selectedUser.id === message.author.id) {
                    return message.reply(
                        `Nie masz powiązanego konta w panelu, proszę utworzyć lub powiązać konto.\n\`${Config.DiscordBot.Prefix}user new\` - Utwórz konto\n\`${Config.DiscordBot.Prefix}user link\` - Powiąż konto`,
                    );
                } else {
                    return message.reply("Ten użytkownik nie ma powiązanego konta panelu.");
                }
            }

            const response = await axios({
                url:
                    Config.Pterodactyl.hosturl +
                    "/api/application/users/" +
                    userData.get(selectedUser.id).consoleID +
                    "?include=servers",
                method: "GET",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: "Bearer " + Config.Pterodactyl.apikey,
                    "Content-Type": "application/json",
                    Accept: "Application/vnd.pterodactyl.v1+json",
                },
            });

            const preoutput = response.data.attributes.relationships.servers.data;

            let actualPremiumServersUsed = 0;

            for (let index = 0; index < preoutput.length; index++) {
                if (Config.DonatorNodes.includes(preoutput[index].attributes.node))
                    ++actualPremiumServersUsed;
            }

            const userPremData = userPrem.get(selectedUser.id);

            const storedPremiumServersUsed = userPremData.used;

            if (actualPremiumServersUsed != storedPremiumServersUsed) {
                userPrem.set(selectedUser.id, {
                    used: actualPremiumServersUsed,
                    donated: userPremData.donated,
                });
                replyMsg.edit("Liczba serwerów premium dla tego użytkownika została naprawiona!");
            } else {
                replyMsg.edit("Ten użytkownik ma poprawną liczbę serwerów premium!");
            }
        } catch (err) {
            replyMsg.edit(`<:No:768256005426511912> Wystąpił błąd\n\`\`\`${err.message}\`\`\``);
        }
    }
};