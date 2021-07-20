exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => ["639489438036000769", "639481606112804875"].some(x => x == r.id))) return;

    if (!args[1]) {
        message.channel.send('Channel is now locked. Only admins+ can post here \nUse `DBH!staff lockdown unlock` to unlock this channel')
        message.channel.updateOverwrite(config.DiscordBot.mainGuild, {
            SEND_MESSAGES: false
        })
    } else if (args[1].toLowerCase() === "unlock") {
        message.channel.send('Channel is now unlocked. Everyone can now send messages here again!')
        message.channel.updateOverwrite(config.DiscordBot.mainGuild, {
            SEND_MESSAGES: null
        })
    }
}