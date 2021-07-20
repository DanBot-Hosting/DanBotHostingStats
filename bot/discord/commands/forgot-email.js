const Discord = require("discord.js");


exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("DanBot Hosting - Email Recovery")
        .setDescription("Check you're DM's for your email.")
        .setFooter("Email Recovery")
        .setTimestamp()
    message.channel.send(embed)
  client.users.cache.get(message.author.id).send("Email: " + userData.fetch(message.author.id + ".email"))
};
