let findDuplicates = arr => arr.filter((e, i) => arr.indexOf(e) != i)
module.exports = async (client, e) => {
    if (e.t === "MESSAGE_REACTION_ADD") {
        let channel = bot.channels.get(e.d.channel_id);
        /**
         * @type {Discord.Message}
         */
        let message = await channel.fetchMessage(e.d.message_id);

        let member = message.guild.members.get(e.d.user_id);
        let emoji = e.d.emoji;

        let reactionMessage = message.reactions.find(x => x.emoji.id === emoji.id || x.emoji.name === emoji.name);

        bot.emit('reactionAdd', reactionMessage, member)
    }

    if (e.t === "MESSAGE_REACTION_REMOVE") {
        let channel = bot.channels.get(e.d.channel_id);
        /**
         * @type {Discord.Message}
         */
        let message = await channel.fetchMessage(e.d.message_id);

        let member = message.guild.members.get(e.d.user_id);
        let emoji = e.d.emoji;

        let reactionMessage = message.reactions.find(x => x.emoji.id === emoji.id || x.emoji.name === emoji.name);

        bot.emit('reactionRemove', reactionMessage, member)

    }
}