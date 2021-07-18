const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} | Tickets Help`, client.user.avatarURL())
    .addField(`🎫 | Ticket Commands`, `> \`${config.prefix}ticket new\`\n> \`${config.prefix}ticket close\`\n> \`${config.prefix}ticket add\`\n> \`${config.prefix}ticket remove\`\n> \`${config.prefix}ticket upgrade\`\n> \`${config.prefix}ticket downgrade\``)
    .setThumbnail('https://cdn.discordapp.com/emojis/860696559573663815.png?v=1')
    .setColor(message.guild.me.displayHexColor)
    .setTimestamp()
    await message.channel.send(embed)
}
