const config = require("../config.json");
const { Client, GuildMember } = require("discord.js");

module.exports = {
    event: "guildMemberAdd",
    /**
     * @param {Client} client 
     * @param {GuildMember} member 
     */
    run: async (client, member) => {

        const placeholders = {
            "{server_name}": member.guild.name,
            "{server_id}": member.guild.id,
            "{user_name}": member.user.username,
            "{user_id}": member.user.id,
            "{user_ping}": member.user.toString()
        }

        let msg = config.discord.messages.welcome;

        for (const placeholder in placeholders) {
            msg = msg.replace(placeholder, placeholders[placeholder]);
        }

        const channel = member.guild.channels.cache.get(config.discord.channels.welcome);

        if (channel) {
            channel.send(msg);
        }
    }
}