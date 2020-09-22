let db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    
    let botID = args[0];
    if (message.mentions.users.first()) {
      let t = message.mentions.users.first();
      botID = t.id;
    };
    
    if(!botID)return message.channel.send("Error: Please provide a bot id!");
    let bot = db.get(`${botID}`);
    
    if(!bot)return message.channel.send("Error: The bot you gave is not in my database!");
    if(bot.deleted)return message.channel.send("Error: This bot has been deleted.");
    
    let infoEmbed = new Discord.RichEmbed()
    .setColor("BLUE")
    .setTitle(`${bot.client.username} | DanBot Hosting Stats`)
    .setURL("https://danbot.host/bot/" + bot.id)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${bot.id}/${bot.client.avatar}`)
    .setDescription(`
    **Status:** ${bot.status}
    **Servers:** ${bot.servers.toLocaleString()}
    **Users:** ${bot.users.toLocaleString()}
    `)
    .addField("Owner", `<@${bot.owner}> \`(${bot.owner})\``)
    
    message.channel.send(infoEmbed)

};