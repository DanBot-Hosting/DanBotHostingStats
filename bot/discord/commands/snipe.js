exports.run = async (client, message, args) => {
    let embed3 = new Discord.MessageEmbed().setDescription(`Theres nothing to snipe`)

    let snipe = messageSnipes.get(message.channel.id)

    if (snipe == null) return message.channel.send(embed3)

    snipe = [...snipe.values()]

    //Reversing the array 
    snipe.reverse();

    // getting the number
    let number = 0;

    if (args[0] == null) number = 0;
    else number = parseInt(args[0] - 1);

    //setting a min and max
    if (number >= snipe.length) number = snipe.length - 1;
    if (number < 0) number = 0;

    // getting the message
    let snipedMessage = snipe[number];

    console.log("SNIPE", snipedMessage, snipe, number);

    //sending the message
    const embed = new Discord.MessageEmbed()
        .setTitle(`Message ${snipedMessage.action} by ${snipedMessage.member.user.tag}`)
        .setDescription("`" + snipedMessage.message + "`")
        .setFooter(`${number + 1}/${snipe.length}`).setTimestamp(snipedMessage.timestamp)
        .setColor("GREEN");
    message.channel.send(embed);
}