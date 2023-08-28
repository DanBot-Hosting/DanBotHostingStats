const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    try {
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({ format: "png", dynamic: true }))
            .setTitle("Member Count")
            .setDescription(`**Total**: ${message.guild.memberCount}\n**Humans**: ${message.guild.members.cache.filter(member => !member.user.bot).size}\n**Bots**: ${message.guild.members.cache.filter(member => member.user.bot).size}`)
    
        message.reply(embed);
    } catch(err) {
        message.reply(err.message);
    }
};
