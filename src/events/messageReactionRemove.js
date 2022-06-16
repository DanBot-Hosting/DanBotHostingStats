const { Client, MessageReaction, User } = require("discord.js");
const config = require('../config.json');

module.exports = {
    event: "messageReactionRemove",
    /**
     * @param {Client} client 
     * @param {MessageReaction} reaction
     * @param {User} user
     */
    run: async (client, reaction, user) => {
        const { message, emoji } = reaction;
        const member = await message.guild.members.fetch(user.id).catch(() => null);

        if (user.bot) return;
        if (!member) return;
        if (reaction.partial) await reaction.fetch();
        if (message.partial) await message.fetch();

        const rrObject = config.discord.reactionRoles.find(m => m.messageId === message.id);
        if (!rrObject) return;

        const reactionObject = rrObject.reactions.find(m => m.emoji === emoji.name || m.emoji === emoji.id);
        if (!reactionObject) return;

        const placeholders = {
            "{role_name}": message.guild.roles.cache.get(reactionObject.roleId).name,
            "{server_name}": message.guild.name,
        }

        let msg = config.discord.messages.roleRemoved;

        for (const placeholder in placeholders) {
            msg = msg.replace(placeholder, placeholders[placeholder]);
        }

        try {
            await member.roles.remove(reactionObject.roleId, 'Reaction role');
            await member.send(msg);
        } catch (err) {
            throw new Error(`Failed to remove role ${reactionObject.roleId} to ${member.user.tag}`, err.message);
        }
    }
}