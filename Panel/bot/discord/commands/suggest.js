let db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

let embed = new Discord.RichEmbed()
.setColor("BLUE")
.setTitle("DanBot Hosting Suggestion")
.setDescription("To send in Suggestions and or Feedback please visit our Feedback form [Here](https://stats.danbot.xyz/feedback)")
message.channel.send(embed)

};