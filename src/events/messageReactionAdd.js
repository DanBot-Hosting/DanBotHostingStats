const { Client, MessageReaction, User } = require("discord.js");
const { discord: { reactionRoles } } = require('../config.json');

// TODO: test this
module.exports = {
    event: "messageReactionAdd",
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

        const rrObject = reactionRoles.find(m => m.messageId === message.id);
        if (!rrObject) return;
        
        const reactionObject = rrObject.reactions.find(m => m.emoji === emoji.name || m.emoji === emoji.id);
        if (!reactionObject) return;

        try {
            await member.roles.add(reactionObject.roleId, 'Reaction role');
        } catch (err) {
            throw new Error(`Failed to add role ${reactionObject.roleId} to ${member.user.tag}`, err.message);
        }
    }
}