exports.run = async(client, message, args) => {
    if (!message.channel.name.includes('-ticket')) return message.channel.send(`💡 | You can only use this command in a ticket channel.`)

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[1])
    if (!user) return message.channel.send(`💡 | Please mention or specify the user's ID you want to add to this ticket.`)

    if (user.roles.cache.some(role => role.id === '898041751099539497')) return message.channel.send(`💡 | You can't remove staff from tickets.`)

    await message.channel.updateOverwrite(user, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: false
    })

    message.channel.send(`💡 | Succesfully removed ${user} from this ticket.`)
}
