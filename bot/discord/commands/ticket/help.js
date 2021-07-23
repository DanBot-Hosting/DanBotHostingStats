const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} | Tickets Help`, client.user.avatarURL())
    .addField(`🎫 | Ticket Commands`, `> \`${config.DiscordBot.Prefix}ticket new\`\n> \`${config.DiscordBot.Prefix}ticket close\`\n> \`${config.DiscordBot.Prefix}ticket add\`\n> \`${config.DiscordBot.Prefix}ticket remove\`\n> \`${config.DiscordBot.Prefix}ticket upgrade\`\n> \`${config.DiscordBot.Prefix}ticket downgrade\``)
    .setThumbnail('https://cdn.discordapp.com/emojis/860696559573663815.png?v=1')
    .setColor(message.guild.me.displayHexColor)
    .setTimestamp()
    await message.channel.send(embed)
}
