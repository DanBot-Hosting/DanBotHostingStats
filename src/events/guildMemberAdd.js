const Discord = require("discord.js");

const Config = require("../../config.json");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.GuildMember} member 
 * @param {Discord.Guild} guild 
 * @returns 
 */
module.exports = async (client, member, guild) => {

    // If the user is a bot, returns.
    if (member.user.bot) return;

    // If user didn't have a object in user premium, creates one.
    if (userPrem.get(member.id) == null) {
        userPrem.set(member.id, {
            used: 0,
            donated: 0,
        });
    }

    // If the user has a console account linked, give them the client role.
    if (userData.get(member.id) !== null) {
        member.roles.add(Config.DiscordBot.Roles.Client);
    };

    // If the user has donated before, gives them the donator role.
    if (userPrem.get(`${member.id}.donated`) > 0) {
        member.roles.add(Config.DiscordBot.Roles.Donator);
    }
};