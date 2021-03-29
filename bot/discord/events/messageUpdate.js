const e = require("express");

module.exports = (client, oldMessage, newMessage) => {


    // Snipe Command:

    if (oldMessage.author.bot || !oldMessage.content) return;

    let data = {
        message: oldMessage.content,
        author: oldMessage.member,
        timestamp: Date.now(),
        action: "edit"
    };

    if (messageSnipes.get(oldMessage.channel.id) == null) messageSnipes.set(oldMessage.channel.id, [data])
    else messageSnipes.set(oldMessage.channel.id, [...messageSnipes.get(oldMessage.channel.id), data]);

    messageSnipes.set(oldMessage.channel.id, messageSnipes.get(oldMessage.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));

    // --------------



}