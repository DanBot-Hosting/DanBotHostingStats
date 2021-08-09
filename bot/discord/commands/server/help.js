exports.run = async (client, message, args) => {
    
    let prefix = config.DiscordBot.Prefix

    let embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} | Server Help`, client.user.avatarURL())
    .addField(`💻 | Server Commands`, `> \`${prefix}server create\`\n> \`${prefix}server delete\`\n> \`${prefix}server list\`\n> \`${prefix}server proxy\`\n> \`${prefix}server redeem\`\n> \`${prefix}server status\`\n> \`${prefix}server unproxy\`\n`)
    .setThumbnail(client.user.avatarURL())
    .setColor(message.guild.me.displayHexColor)
    .setTimestamp()

    if (message.member.roles.cache.get('710208090741539006') || message.member.roles.cache.get('788193704014905364')) {
        embed.addField(`💰 | Donator/Booster Help`, `> \`${prefix}server create-donator\``)
    }

    if (message.member.roles.cache.get('793549158417301544')) {
        embed.addField(`⚗️ | Beta Help`, `> \`${prefix}server create-beta\``)
    }

    await message.channel.send({ embed: embed })
}
