exports.run = async (client, message, args) => {
if (!message.channel.name.includes('-ticket')) {
    message.channel.send('This command is only to be used inside of ticket channels.')
    return;
}
let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
if(!member){
    return message.channel.send('Please Mention someone or use their ID to remove the user from the ticket')
}
if(member.roles.cache.some(role => role.id === '748117822370086932')) return message.channel.send(`You can't remove staff From tickets`)
    await message.channel.updateOverwrite(member, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: false
    })
    message.channel.send(`Removed ${member} From the ticket`)
}
}
