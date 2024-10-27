const Discord = require("discord.js");
const Config = require("../../config.json");

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.GuildMember} oldMember
 * @param {Discord.GuildMember} newMember
 * @returns
 */
module.exports = async (client, oldMember, newMember) => {
  // If the user changes their nickname, check if it breaks any rules.
  if (oldMember.displayName != newMember.displayName) {
    const displayName = newMember.displayName.toLowerCase();

    //Hoisting usernames or banned usernames.
    if (
      displayName.match(/^[a-z0-9]/i) == null ||
      Config.BannedNames.some((r) => displayName.includes(r))
    ) {
      const newNickname =
        displayName.match(/^[a-z0-9]/i) == null
          ? "I love Dan <3"
          : "Moderated Nickname";
      await newMember.setNickname(newNickname);
    }
  }
};
