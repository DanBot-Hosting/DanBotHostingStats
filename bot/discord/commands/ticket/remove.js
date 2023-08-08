exports.run = async (client, message, args) => {
    if (!message.channel.name.includes("-ticket"))
        return message.reply(`💡 | You can only use this command in a ticket channel.`);

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
    if (!user) return message.reply(`💡 | Please mention or specify the user's ID you want to add to this ticket.`);

    await message.channel.updateOverwrite(user, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: false,
    });

    message.reply(`💡 | Succesfully removed ${user} from this ticket.`);
};
