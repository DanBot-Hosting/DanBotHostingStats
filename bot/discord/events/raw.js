module.exports = async (client, e) => {
    if (e.t == "MESSAGE_REACTION_ADD") {
        let channel = bot.channels.cache.get(e.d.channel_id);
        let message = await channel.messages.fetch(e.d.message_id);
        let member = message.guild.members.cache.get(e.d.user_id);
        let emoji = e.d.emoji;
        let reactionMessage = message.reactions.cache.find(
            (x) => (x.emoji.id != null && x.emoji.id == emoji.id) || x.emoji.name == emoji.name
        );
        bot.emit("reactionAdd", reactionMessage, member);
    }

    if (e.t == "MESSAGE_REACTION_REMOVE") {
        let channel = bot.channels.cache.get(e.d.channel_id);
        let message = await channel.messages.fetch(e.d.message_id);
        let member = message.guild.members.cache.get(e.d.user_id);
        let emoji = e.d.emoji;
        let reactionMessage = message.reactions.cache.find(
            (x) => (x.emoji.id != null && x.emoji.id == emoji.id) || x.emoji.name == emoji.name
        );
        bot.emit("reactionRemove", reactionMessage, member);
    }
};
