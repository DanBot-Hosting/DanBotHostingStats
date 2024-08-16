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

    // If the user changes their nickname, check if it's breaks any rules.
    if (oldMember.displayName != newMember.displayName) {

        const displayName = newMember.displayName.toLowerCase();

        //H oisting usernames.
        if (displayName.match(/^[a-z0-9]/i) == null) {
            return newMember.setNickname("Kocham wojtoteke <3");
        };

        // Banned usernames.
        if (Config.BannedNames.some((r) => displayName.includes(r))) {
            newMember.setNickname("Moderated Nickname");
        };
    }
};