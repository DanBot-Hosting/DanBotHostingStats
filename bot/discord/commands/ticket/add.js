exports.run = async (client, message, args) => {
    
        if (!message.channel.name.includes('-ticket')) return message.channel.send(`💡 | You can **only** use this **command** in **ticket channel**!`)
    
        if(!args[1]) {
            return message.channel.send(`💡 | You **need** to enter user's **ID** to add him to **this ticket**!`)
        }

        if(!message.guild.members.cache.get(args[1])) {

            return message.channel.send(`💡 | You **need** to enter a valid user's **ID** to add him to **this ticket**!`)

        }

        await message.channel.updateOverwrite(args[1], {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })

        await message.channel.send(`💡 | Succesfully added **${message.guild.members.cache.get(args[1])}** to this **ticket**.`)
}

