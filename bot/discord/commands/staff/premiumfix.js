const premiumNodes = [31, 33, 34, 35, 39];

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "898041751099539497")) return;

    if (!args[1]) {
        return message.reply("Please specify a user!");
    } else {
        const replyMsg = await message.reply("Starting calculation...");

        try {
            let selectedUser = await client.users.cache.get(args[1].match(/\d{17,19}/).length == 0 ? args[1] : args[1].match(/\d{17,19}/)[0]);

            const userAccount = userData.get(selectedUser.id);

            if (userAccount == null || userAccount.consoleID == null) {
                if (selectedUser.id === message.author.id) {
                    return message.reply(`You do not have a panel account linked, please create or link an account.\n\`${config.DiscordBot.Prefix}user new\` - Create an account\n\`${config.DiscordBot.Prefix}user link\` - Link an account`)
                } else {
                    return message.reply("That user does not have a panel account linked.");
                }
            }

            const response = await axios({
                url:
                    "https://panel.danbot.host" +
                    "/api/application/users/" +
                    userData.get(selectedUser.id).consoleID +
                    "?include=servers",
                method: "GET",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: "Bearer " + config.Pterodactyl.apikey,
                    "Content-Type": "application/json",
                    Accept: "Application/vnd.pterodactyl.v1+json",
                },
            });

            const preoutput = response.data.attributes.relationships.servers.data;

            let actualPremiumServersUsed = 0;

            for (let index = 0; index < preoutput.length; index++) {
                if (premiumNodes.includes(preoutput[index].attributes.node)) ++actualPremiumServersUsed;
            }

            const userPremData = userPrem.get(selectedUser.id);

            const storedPremiumServersUsed = userPremData.used;

            console.log({ actualPremiumServersUsed, storedPremiumServersUsed, userPremData, selectedUser });

            if (actualPremiumServersUsed != storedPremiumServersUsed) {
                userPrem.set(selectedUser.id, { used: actualPremiumServersUsed, donated: userPremData.donated });
                replyMsg.edit(`**${selectedUser.username}**'s premium server count has been fixed!`);
            } else {
                replyMsg.edit(`**${selectedUser.username}** has the correct premium server count!`);
            }
        } catch(err) {
            replyMsg.edit(`<:No:768256005426511912> An error occurred\n\`\`\`${err.message}\`\`\``);
        }
    }
};
