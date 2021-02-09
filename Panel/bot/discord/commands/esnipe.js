exports.run = async (client, message, args) => {
    let embed3 = new Discord.MessageEmbed()
            .setDescription(`Theres nothing to snipe`)


if(!args.length) return message.channel.send(`There are a total of ${edits.get(message.channel.id).length} edit snipes. Provide one to view.`);

        let snipe = edits.get(message.channel.id)[args[0]];
        if (!snipe || !snipe.content) return message.channel.send(embed3)

        const embed = new Discord.MessageEmbed()
            //.setAuthor(snipe.message.author.username, snipe.message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setTimestamp()
            .setTitle(`Message by: ${snipe.message.author.tag}`)
            .addFields(
            { name: "Old Content", value: `${snipe.message.content}`, inline: true },
            { name: "New Content", value: `${snipe.editedMessage.content}`, inline: true },
            
            );
            
        message.channel.send(embed);
}
