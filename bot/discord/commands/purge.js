const Discord = require("discord.js");
exports.run = (client, message, args) => {

    if(!message.member.roles.cache.find(r => r.id === '898041751099539497')) {
        return message.channel.send(`🚧 | You **do not** have enough **permissions** to use this **command**.`)
    }

    const embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} | Purge`, client.user.avatarURL())
        .addField(`❓ | Usage:`, `> DBH!purge <amount> <@user>`)
        .addField(`💡 | Example:`, `> DBH!purge 20 @exampleuser`)
        .setColor(message.guild.me.displayHexColor)
        .setTimestamp()

    if(!args[0]) return message.channel.send(embed);

    let user = message.mentions.users.first()
    let amount = !!parseInt(message.content.split(' ')[2]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1])

    if (!amount) return message.channel.send(embed);
    if(isNaN(amount)) return message.channel.send(embed);
    if (!amount && !user) return message.channel.send(embed);

    if (amount < 1 || amount > 99) return message.channel.send(`💡 | Specify a **number** between **1-99** to delete.`)

    message.channel.messages.fetch({ limit: amount }).then(messages => {

        if (user) {
            const filterBy = user ? user.id : client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount + 1);
        }

        message.channel.bulkDelete(messages, true).catch(error => { return message.channel.send(`\`\`\`js\n${error}\`\`\``)});
        message.channel.send(`✅ | Succesfully purged **${amount}** messages.`)

        const success = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} | Purge`, client.user.avatarURL())
            .addField(`💡 | Info:`, `> Moderator: **${message.author.tag}**\n> Amount: **${amount}**\n> Channel: ${message.channel}`)
            .setThumbnail('https://cdn.discordapp.com/emojis/860696522659463199.png?v=1')
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
        return client.channels.cache.get(config.DiscordBot.modLogs).send({ embed: success });
    })
}
