exports.run = async (client, message, args) => {
    if (!['137624084572798976'].includes(message.author.id)) return;

    if (!args[1]) {
        message.channel.send('Usage: `DBH!staff code name uses')
    } else if(!args[2]) {
        message.channel.send('Usage: `DBH!staff code name uses')
    } else {
        message.channel.send('Created code: `' + args[1] + '` with `' + args[2] + '` premium servers.')
        codes.set(args[1], args[2])
    }
}