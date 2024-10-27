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

  // Initialize an array to hold roles to be added
  const rolesToAdd = [];

  // If the user has a console account linked, add the client role.
  if (userData.get(member.id) !== null) {
    rolesToAdd.push(Config.DiscordBot.Roles.Client);
  }

  // If the user has donated before, add the donator role.
  if (userPrem.get(`${member.id}.donated`) > 0) {
    rolesToAdd.push(Config.DiscordBot.Roles.Donator);
  }

  // Add all roles at once
  if (rolesToAdd.length > 0) {
    await member.roles.add(rolesToAdd);
  }
};
