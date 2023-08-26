const axios = require("axios");
exports.run = async (client, message, args) => {
    try {
        let userID = message.author.id;

        // Allow developers to lookup a user's server list
        if (message.member.roles.cache.find((r) => r.id === "898041747597295667")) userID = args[1] || message.author.id;

        const userAccount = userData.get(userID);

        if (userAccount == null) {
            message.reply(
                "You do not have an panel account linked to your Discord account.\n" +
                "If you have not made an account yet please check out `" +
                config.DiscordBot.Prefix +
                "user new` to create an account \nIf you already have an account link it using `" +
                config.DiscordBot.Prefix +
                "user link`"
            );
            return;
        }

        const loadingMsg = await message.reply("Loading servers...");

        // List servers
        var arr = [];

        axios({
            url: `https://panel.danbot.host/api/application/users/${userAccount.consoleID}?include=servers`,
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikey}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        }).then((response) => {
            const preoutput = response.data.attributes.relationships.servers.data;
            arr.push(...preoutput);

            const donoNodes = [34, 31, 33, 35, 39];
            const clean = arr.map((server) => {
                const emoji = donoNodes.includes(server.attributes.node) ? ":money_with_wings:" : ":free:";

                return `${emoji} ${server.attributes.name} (\`${server.attributes.identifier}\`)`;
            });

            if (clean.length == 0) {
                message.reply("You don't have any servers unfortunately.");
            } else if (clean.length > 70) {
                message.reply("You too many servers to display!");
            } else if (clean.length > 20) {
                const serverListEmbed = new Discord.MessageEmbed();
                    .setDescription(`You have too many servers to display, here is a shortened list.\nYou have ${arr.length} servers.`)
                    .addField("Your Servers", arr.map((i) => `\`${i.attributes.identifier}\``));
                message.reply(serverListEmbed);
            } else {
                const serverListEmbed = new Discord.MessageEmbed();
                    .setDescription(`You have ${arr.length} servers.`);
                    .addField("Your Servers", clean);
                message.reply(serverListEmbed);
            }

            loadingMsg.delete();
        });
    } catch (error) {
        console.log(error);
    }
};
