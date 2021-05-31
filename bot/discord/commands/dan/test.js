const axios = require('axios')
exports.run = async (client, message, args) => {
    const data = {
        max_age: 86400,
        max_uses: 0,
        target_application_id: "755600276941176913", // youtube together
        target_type: 2,
        temporary: false,
        validate: null
    }
    axios({
        url: `https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`,
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bot ' + config.DiscordBot.Token,
            'Content-Type': 'application/json',
        },
        data: data
    }).then(invite => {
        message.channel.send(`✅ | Click here to start **YouTube Together** : <https://discord.gg/${invite.data.code}>`);
    }).catch(err => {
        console.log(err)
    })
}
