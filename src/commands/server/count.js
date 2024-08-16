const Discord = require('discord.js');
const axios = require("axios");

const Config = require('../../../config.json');
const getUserServers = require('../../util/getUserServers.js');

exports.description = "Pokazuje liczbę serwerów, które ma użytkownik.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    let userId = args[1]?.match(/[0-9]{17,19}/)?.[0] || message.author.id; // ID użytkownika Discorda.

    const user = userData.get(userId);

    if (user == null) return message.channel.send('Użytkownik nie ma powiązanego konta.');

    await getUserServers(user.consoleID).then(Response => {
        const userServers = Response.attributes.relationships.servers.data; // Dane serwera użytkownika z panelu.

        const premiumServers = userServers.filter((Server) => Config.DonatorNodes.includes(Server.attributes.node)).length; // Liczba serwerów premium, które ma użytkownik.

        const serverCountEmbed = new Discord.MessageEmbed().setDescription(`
                :free: Darmowe serwery: ${userServers.length - premiumServers}\n:money_with_wings: Serwery premium: ${premiumServers}
            `);

        message.channel.send(serverCountEmbed);
    }).catch(() => {
        message.channel.send("Wystąpił błąd podczas ładowania serwerów.");
    });
};