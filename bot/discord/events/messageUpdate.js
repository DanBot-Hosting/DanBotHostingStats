module.exports = (client, oldMessage, newMessage) => {


    // Snipe Command:

    snipes.set(oldMessage.channel.id, [...snipes.get(oldMessage.channel.id), {
        message: oldMessage.content,
        author: oldMessage.member,
        timestamp: Date.now(),
        action: "edit"
    }]);

    snipes.set(oldMessage.channel.id, snipes.get(oldMessage.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));

    // --------------



}