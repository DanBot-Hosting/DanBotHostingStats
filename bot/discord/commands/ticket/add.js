exports.run = async (client, message, args) => {
    if (!message.channel.name.includes('-ticket')) {
        message.channel.send('This command is only to be used inside of ticket channels.')
        return;
    }

    if (!args[1] || !message.guild.members.cache.get(args[1])) {
        message.channel.send('Please run this command again with the users ID')
    } else {
        await message.channel.updateOverwrite(args[1], {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })
        message.channel.send("Success!")
    }
}

