exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => ["898041741695926282", "898041747219828796"].some(x => x == r.id))) return;

    if (!args[1]) {
        message.channel.send('Channel is now locked. Only admins+ can post here \nUse `DBH!staff lockdown unlock` to unlock this channel')
        message.channel.updateOverwrite("639477525927690240", {
            SEND_MESSAGES: false
        })
    } else if (args[1].toLowerCase() === "unlock") {
        message.channel.send('Channel is now unlocked. Everyone can now send messages here again!')
        message.channel.updateOverwrite("639477525927690240", {
            SEND_MESSAGES: null
        })
    }
}