exports.run = async (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');
        message.delete()
        message.channel.send(args)
};
