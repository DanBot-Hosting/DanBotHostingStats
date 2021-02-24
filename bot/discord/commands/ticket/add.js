exports.run = async (client, message, args) => {
    if (message.channel.name.includes('-ticket')) {
        if (args[1] === "") {
            message.channel.send('Please run this command again with the users ID')
        } else {
            console.log(args[1])
            await message.channel.cache.overwritePermissions(args[1], {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            })
        }
    } else {
        message.channel.send('This command is only to be used inside of ticket channels.')
    }
}
