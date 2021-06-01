exports.run = async (client, message, args) => {
    let staffRole = message.guild.roles.cache.get('748117822370086932');

    if (message.channel.name.includes('-ticket')) {
        message.reply("Now all staff can see your tickwt.")
        await message.channel.updateOverwrite('748117822370086932', {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        });
    } else {
        message.channel.send('This command is only to be used inside of ticket channels.')
    }
}
