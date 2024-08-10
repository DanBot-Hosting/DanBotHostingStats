const Discord = require('discord.js');
const axios = require("axios");
const Config = require('../../../config.json');

exports.description = "Shows the amount of servers a user has.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    let userId = args[1]?.match(/[0-9]{17,19}/)?.[0] || message.author.id; //The Discord User ID.

    axios({
        url:
            Config.Pterodactyl.hosturl +
            "/api/application/users/" +
            userData.get(userId).consoleID +
            "?include=servers",
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: "Bearer " + Config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
    })
        .then((response) => {
            const userServers = response.data.attributes.relationships.servers.data; //The user server data from the panel.

            const premiumServers = userServers.filter((Server) => config.DonatorNodes.includes(Server.attributes.node)).length; //The amount of premium servers the user has.

            const serverCountEmbed = new Discord.MessageEmbed().setDescription(`
                :free: Free Server(s): ${userServers.length - premiumServers}\n:money_with_wings: Premium Server(s): ${premiumServers}
            `);

            message.channel.send(serverCountEmbed);
        })
        .catch(() => {
            message.reply("An error occurred while loading servers.");
        });
};