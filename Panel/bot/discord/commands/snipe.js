exports.run = async (client, message, args) => {
    try {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.snipes.get(message.channel.id).author.tag}`, `${bot.snipes.get(message.channel.id).author.displayAvatarURL({ dynamic: true, format: 'png' })}`)
            .setDescription(`${client.snipes.get(message.channel.id).content}`)
            .setColor('RANDOM')
            .setTimestamp(`${client.snipes.get(message.channel.id).timestamp}`)
        message.channel.send(embed)
    } catch (err) {
        message.channel.send(`There's nothing to snipe!`);
    };
}