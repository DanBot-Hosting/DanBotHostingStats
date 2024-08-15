const Discord = require('discord.js');
const axios = require("axios");

const Config = require('../../../config.json');
const getUserServers = require('../../util/getUserServers.js');

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

    const user = userData.get(userId);

    if (user == null) return message.channel.send('User does not have account linked.');

    await getUserServers(user.consoleID).then(Response => {
            const userServers = Response.attributes.relationships.servers.data; //The user server data from the panel.

            const premiumServers = userServers.filter((Server) => Config.DonatorNodes.includes(Server.attributes.node)).length; //The amount of premium servers the user has.

            const serverCountEmbed = new Discord.MessageEmbed().setDescription(`
                :free: Free Server(s): ${userServers.length - premiumServers}\n:money_with_wings: Premium Server(s): ${premiumServers}
            `);

            message.channel.send(serverCountEmbed);
    }).catch(() => {
        message.channel.send("An error occurred while loading servers.");
    });
};