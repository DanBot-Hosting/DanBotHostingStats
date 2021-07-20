exports.run = async (client, message, args) => {
    if (!message.channel.name.includes('-ticket')) return message.channel.send(`💡 | You can **only** use this **command** in **ticket channel**!`)

    let user = message.mentions.users.first() || message.guild.members.cache.get(args[1])
    if (!user) return message.channel.send(`💡 | You **need** to mention someone or enter a valid user's **ID** to remove someone from **this ticket**!`)

    await message.channel.updateOverwrite(user, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true
    })

    message.channel.send(`💡 | Succesfully **Added** ${user} from this **ticket**!`)
}