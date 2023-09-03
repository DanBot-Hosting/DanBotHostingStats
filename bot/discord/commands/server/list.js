const axios = require("axios");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let user = message.author;
    let userID = message.author.id;

    // Allow developers to lookup a user's server list
    if (message.member.roles.cache.find((r) => r.id === "898041747597295667")) userID = args[1] || message.author.id;

    const userAccount = userData.get(userID);

    if (userAccount == null || userAccount.consoleID == null) {
        if (userID === message.author.id) {
            return message.reply(`You do not have a panel account linked, please create or link an account.\n\`${config.DiscordBot.Prefix}user new\` - Create an account\n\`${config.DiscordBot.Prefix}user link\` - Link an account`)
        } else {
            return message.reply("That user does not have a panel account linked.");
        }
    }

    if (userID !== message.author.id) {
        user = client.users.cache.get(userID);
    }

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

        const format = (server) => {
            return arr.length > 20
                ? `\`${server.attributes.identifier}\``
                : `**${server.attributes.name}** (ID: \`${server.attributes.identifier}\`)`;
        };

        const donoNodes = [34, 31, 33, 35, 39];

        const freeServers = arr.filter((server) => !donoNodes.includes(server.attributes.node)).map(format);
        const donoServers = arr.filter((server) => donoNodes.includes(server.attributes.node)).map(format);

        if (arr.length == 0) {
            message.reply(`${userID === message.author.id ? "You do" : "That user does"} not have any servers.`);
        } else if (arr.length > 70) {
            message.reply(`${userID === message.author.id ? "You have" : "That user has"} too many servers to display!`);
        } else if(freeServers.length + donoServers.length > 20) {
            const serverListEmbed = new Discord.MessageEmbed()
                .setTitle(`Server List (${arr.length})`);

            if (userID !== message.author.id) serverListEmbed.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true }), `https://discord.com/users/${user.id}`);
            if (freeServers.length > 0) serverListEmbed.addField(`:free: Free (${freeServers.length})`, freeServers.join(", "));
            if (donoServers.length > 0) serverListEmbed.addField(`:money_with_wings: Premium (${donoServers.length})`, donoServers.join(", "));

            message.reply(serverListEmbed);
        } else {
            const serverListEmbed = new Discord.MessageEmbed()
                .setTitle(`Server List (${arr.length})`);

            if (userID !== message.author.id) serverListEmbed.setAuthor(user.tag, user.displayAvatarURL({ format: "png", dynamic: true }), `https://discord.com/users/${user.id}`);
            if (freeServers.length > 0) serverListEmbed.addField(`:free: Free (${freeServers.length})`, freeServers.join("\n"));
            if (donoServers.length > 0) serverListEmbed.addField(`:money_with_wings: Premium (${donoServers.length})`, donoServers.join("\n"));

            message.reply(serverListEmbed);
        }
    }).catch(() => message.reply("An error occurred while loading servers."));
};
