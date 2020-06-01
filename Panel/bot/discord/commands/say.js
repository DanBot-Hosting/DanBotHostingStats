exports.run = async (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');

    if (message.member.roles.find(r => r.name === "Owner")) {
        message.delete()
        message.channel.send(args)
    }
};