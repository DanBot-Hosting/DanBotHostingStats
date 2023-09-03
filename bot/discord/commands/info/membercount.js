const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({ format: "png", dynamic: true }))
        .setTitle("Member Count")
        .setDescription(`:busts_in_silhouette: **Total**: ${message.guild.memberCount}\n:bust_in_silhouette: **Humans**: ${message.guild.members.cache.filter(member => !member.user.bot).size}\n:robot: **Bots**: ${message.guild.members.cache.filter(member => member.user.bot).size}`)

    message.reply(embed);
};
