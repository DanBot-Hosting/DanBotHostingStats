const e = require("express");

module.exports = (client, oldMessage, newMessage) => {


    // Snipe Command:

    if (oldMessage.author == null || oldMessage.author.bot == true || !oldMessage.content || newMessage == null) return;
    let attachments;
    if (oldMessage.attachments !== newMessage.attachments) attachments = oldMessage.attachments.map(x => x.proxyURL);
    let data = {
        content: oldMessage.content,
        member: oldMessage.member,
        timestamp: Date.now(),
        action: "edit"
    };
    if (attachments) data.attachments = attachments;

    if (messageSnipes.get(oldMessage.channel.id) == null) messageSnipes.set(oldMessage.channel.id, [data])
    else messageSnipes.set(oldMessage.channel.id, [...messageSnipes.get(oldMessage.channel.id), data]);

    messageSnipes.set(oldMessage.channel.id, messageSnipes.get(oldMessage.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));

    // --------------


}