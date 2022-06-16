const Discord = require("discord.js");

exports.run = async(client, message, args) => {

    let linksembed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setTitle(`DanBot Hosting Links`)
        .addField("Website", "[Link](https://danbot.host)", true)
        .addField("Panel", "[Link](https://panel.danbot.host)", true)
        .addField("Cloud", "[Link](https://danbot.cloud)", true)
        .addField("Authentication", "[Link](https://auth.danbot.host)", true)

    return message.channel.send(linksembed)

};
