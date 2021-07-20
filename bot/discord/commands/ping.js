const Discord = require("discord.js");


exports.run = async (client, message, args) => {

    let embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("DanBot Hosting - Ping")
        .setDescription(`API Latency: ${Math.round(client.ws.ping)}ms`)
        .setTimestamp()
    message.channel.send({
        embeds: [embed]
    })

};