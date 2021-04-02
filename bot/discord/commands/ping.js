const Discord = require("discord.js");


exports.run = async (client, message, args) => {

let embed = new Discord.MessageEmbed()
.setColor("RED")
.setTitle("DanBot Hosting - Ping")
.setDescription(`API Latency: ${Math.round(client.ws.ping)}ms`)
.setFooter("Command Created by Kyro#3400")
.setTimestamp()
message.channel.send(embed)

};
