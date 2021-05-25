let parser = new Intl.NumberFormat();
const axios = require('axios');
exports.run = async (client, message, args) => {
    let boosted = await axios({
        url: "http://admin.danbot.host:1029",
        timeout: 3000,
        method: 'GET',
        headers: {
            "password": config.externalPassword
        },
    }).catch(e => {
        // console.log(e);
    })
    let userid = args[1] == null ? (message.author.id) : (args[1].match(/[0-9]{18}/).length == 0 ? args[1] : args[1].match(/[0-9]{18}/)[0]);

    let user = userPrem.fetch(userid);
    if (user == null) {
        message.channel.send('You are not a premium user');
        return;
    }

    let allowed = Math.floor(user.donated / config.node7.price);
    if (message.member.roles.cache.get('710208090741539006') != null)
        allowed = allowed + (boosted.data[userid] != null ? Math.floor(boosted.data[userid] * 2.5) : 2);
    const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .addField('Premium servers used:', (user.used || 0) + " out of  " + parser.format(allowed) + " servers used")
    await message.channel.send(embed)
}