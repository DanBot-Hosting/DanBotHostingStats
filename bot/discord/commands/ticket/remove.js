exports.run = async (client, message, args) => {
    if (args[1] === "") {
        message.channel.send('Please run this command again with the users ID')
    } else {
        await message.channel.cache.overwritePermissions(args[1], {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false
        })
    }
}
