exports.run = async (client, message, args) => {
    if (!message.channel.name.includes("-ticket"))
        return message.reply(`💡 | You can only use this command in a ticket channel.`);

    if (!args[1]) {
        return message.reply(`💡 | You need to specify the user's ID whom you want to add to this ticket.`);
    }

    if (!message.guild.members.cache.get(args[1])) {
        return message.reply(`💡 | Enter a valid user ID.`);
    }

    await message.channel.updateOverwrite(args[1], {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
    });

    await message.reply(`💡 | Succesfully added **${message.guild.members.cache.get(args[1])}** to this ticket.`);
};
