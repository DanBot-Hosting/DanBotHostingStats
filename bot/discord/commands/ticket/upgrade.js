exports.run = async (client, message, args) => {
    if (message.channel.name.includes('-ticket')) {
        message.reply("Only admins can see this ticket now.")
        await message.channel.overwritePermissions([{
            id: '748117822370086932',
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
        }, {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
        }]);
    } else {
        message.channel.send('This command is only to be used inside of ticket channels.')
    }
}
