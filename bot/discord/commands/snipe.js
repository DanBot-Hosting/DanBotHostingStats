exports.run = async (client, message, args) => {
    let embed3 = new Discord.MessageEmbed().setDescription(`Theres nothing to snipe`)

    let snipe = Messagesnipes.get(message.channel.id)

    if (!snipe) return message.channel.send(embed3)


    let number = 0;

    if(args[0] == null) number = 0;
    else number = parseInt(args[0] - 1);

    if(number >= snipe.length) number = snipe.length - 1;
    if(number < 0) number = 0;

    let snipedMessage = snipe[number];
        

        const embed = new Discord.MessageEmbed()
            //.setAuthor(snipe.author.username, snipe.author.avatarURL({ dynamic: true, format: 'png' }))
            .setTimestamp()
            .setTitle(`Message by: ${snipedMessage.user.tag}`)
            .setDescription("`" + snipedMessage.message + "`")
            .setFooter(`action: ${snipedMessage.action} at `).setTimestamp(msnipedMessageessage.timestamp)
        message.channel.send(embed);
}