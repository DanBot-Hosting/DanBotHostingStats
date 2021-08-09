const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    let prefix = 'DBH!' // config.DiscordBot.Prefix

    let embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} | Help`, client.user.avatarURL())
    .addField(`📺 | Help Section`, `> \`${prefix}user help\`\n> \`${prefix}help server\`\n> \`${prefix}ticket help\``)
    .setThumbnail(client.user.avatarURL())
    .setColor(message.guild.me.displayHexColor)
    .setTimestamp()

    if (message.member.roles.cache.get('748117822370086932')) {
        embed.addField(`💡 | Staff Help`, `> \`${prefix}staff help\``)
    }

    embed.addField(`❓ | Mics Commands`, `> \`${prefix}stats\`\n> \`${prefix}ping\`\n> \`${prefix}uptime\`\n> \`${prefix}vc\`\n> \`${prefix}info\``, true)

    if (message.member.roles.cache.get('778237595477606440')) {
        embed.addField(`👑 | Owner Commands`, `> \`${prefix}reload\`\n> \`${prefix}eval\`\n> \`${prefix}exec\`\n> \`${prefix}reload\`\n> \`${prefix}giveaway\`\n> \`${prefix}announce\``, true)
    }

    await message.channel.send({ embed: embed })
    
}
