module.exports = (client, oldMessage, newMessage) => {


    // Snipe Command:

    snipes.set(message.channel.id, [...snipes.get(message.channel.id), {
        message: oldMessage.content,
        author: message.member,
        timestamp: Date.now(),
        action: "edit"
    }]);

    snipes.set(message.channel.id, snipes.get(message.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));

    // --------------



}