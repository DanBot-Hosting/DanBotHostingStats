exports.run = async (client, message, args) => {
    
    let prefix = config.DiscordBot.Prefix

    let embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} | User Help`, client.user.avatarURL())
    .addField(`🎭 | User Commands`, `> \`${prefix}user link\`\n> \`${prefix}user unlink\`\n> \`${prefix}user premium\`\n> \`${prefix}user password\`\n> \`${prefix}user new\`\n> \`${prefix}user invite\``)
    .setThumbnail(client.user.avatarURL())
    .setColor(message.guild.me.displayHexColor)
    .setTimestamp()

    await message.channel.send({ embed: embed })
}
