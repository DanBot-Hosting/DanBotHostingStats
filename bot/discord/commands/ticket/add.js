exports.run = async (client, message, args) => {
    if (!message.channel.name.includes('-ticket')) {
        message.channel.send('This command is only to be used inside of ticket channels.')
        return;
    }

    if (!args[1] || !message.guild.members.cache.get(args[1])) {
        message.channel.send('Please run this command again with the users ID')
    } else {
        await message.channel.overwritePermissions([{
            id: args[1],
            allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
        }])
        message.channel.send("Sucess!")
    }
}

