const Discord = require('discord.js')
const fs = require('fs')

exports.run = async (client, message, args) => {

    if (!message.channel.name.includes('-ticket')) return message.channel.send(`💡 | You can **only** use this **command** in **ticket channel**!`)

    const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} | Tickets`, client.user.avatarURL())
        .setDescription(`> ❓ | Are you sure you want to close this ticket?\n> 💡 | React with emojis to **open/close** this ticket!`)
        .setColor(message.guild.me.displayHexColor)
        .setTimestamp()

    const msg = await message.channel.send({
        content: `${message.author}`,
        embeds: [embed]
    })
    await msg.react('✔️').catch((err) => {
        message.channel.send(err)
    })
    await msg.react('❌').catch((err) => {
        message.channel.send(err)
    })

    const filter = (rect, usr) => ['✔️', '❌'].includes(rect.emoji.name) && usr.id === message.author.id
    const response = await msg.awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ['time']
        })

        .catch(collected => {

            message.channel.send('🚧 | You **didnt** answer in time im not **closing this ticket!**')

        })

    if (!response) return;
    const emojis = response.first().emoji.name

    if (emojis === '✔️') {

        message.channel.send('🚧 | Im **closing** this **ticket**!').then(

            setTimeout(() => {

                message.channel.messages.fetch().then(async (messages) => {

                    const script = messages.array().reverse().map(m => `${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n')
                    fs.writeFile(`script.txt`, script, (err) => {
                        console.log(err)
                    })
                })

                message.channel.delete()

                const channel = client.channels.cache.get('848714572667682816')
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${client.user.username} | Tickets`, client.user.avatarURL())
                    .setDescription(`> New ticket is closed!`)
                    .addField(`🚧 | Info`, `> **Closed by:** \`${message.author.tag} (${message.author.id})\`\n> **Ticket Name:** \`${message.channel.name}\``)
                    .setThumbnail('https://cdn.discordapp.com/emojis/860696559573663815.png?v=1')
                    .setColor(message.guild.me.displayHexColor)
                    .setTimestamp()
                channel.send({
                    embeds: [embed],
                    files: ["./script.txt"]
                })

            }, 5000))

    }

    if (emojis === '❌') {

        message.channel.send('🚧 | **Ticket** is staying **opened**!');

    }
}