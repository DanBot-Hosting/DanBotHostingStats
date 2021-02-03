const axios = require('axios');
exports.run = async (client, message, args) => {
    let boosted = await axios({
        url: "http://admin.danbot.host:3003",
        timeout: 3000,
        method: 'GET',
        headers: {
            "password": config.externalPassword
        },
    }).catch(e => {
        console.log(e);
    })

    let user = userPrem.fetch(message.author.id);
    if (user == null) {
        message.channel.send('You are not a premium user');
        return;
    }

    let allowed = Math.floor(user.donated / config.node7.price);
    if (message.member.roles.cache.get('710208090741539006') != null)
        allowed = allowed + (boosted.data[message.author.id] != null ? Math.floor(boosted.data[message.author.id] * 2.5) : 2);
    const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .addField('Premium servers used:', user.used + " out of  " + allowed + " servers used")
    await message.channel.send(embed)
}