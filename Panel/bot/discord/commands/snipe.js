exports.run = async (client, message, args) => {
    let embed3 = new MessageEmbed()
            .setDescription(`Theres nothing to snipe`)

        let snipe = snipes.get(message.channel.id)
        if (!snipe || !snipe.content) return message.channel.send(embed3)

        const embed = new Discord.RichEmbed()
            .setAuthor(snipe.author.username, snipe.author.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setTimestamp()
            .setTitle(`Message by: ${snipe.author.tag}`)
            .setDescription(snipe.content)
        message.channel.send(embed);
}