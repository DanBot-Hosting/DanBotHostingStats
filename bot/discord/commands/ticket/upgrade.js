exports.run = async (client, message, args) => {
    let staffRole = message.guild.roles.cache.get('898041751099539497');

    if (message.channel.name.includes('-ticket')) {
        message.reply("Only admins can see this ticket now.")
        await message.channel.updateOverwrite('898041751099539497', {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false
        });
    } else {
        message.channel.send('This command is only to be used inside of ticket channels.')
    }
}
