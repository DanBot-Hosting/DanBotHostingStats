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

    const userAccount = await userData.get(member.id);
    const userPremium = await userPrem.get(member.id);

    // If user didn't have a object in user premium, creates one.
    if (userPremium == null) {
        await userPrem.set(`${member.id}.used`, 0);
        await userPrem.set(`${member.id}.donated`, 0);
    }

    //If the user has a console account linked, give them the client role.
    if (userAccount !== null) {
        await member.roles.add(Config.DiscordBot.Roles.Client).catch((Error) => {});
    };

    //If the user has donated before, gives them the donator role.
    if(userPremium != null && userPremium.donated > 0){
        await member.roles.add(Config.DiscordBot.Roles.Donator).catch((Error) => {});
    }
};
