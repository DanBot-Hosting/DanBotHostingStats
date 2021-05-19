module.exports = (client, message) => {
    if (!message.attachments.size > 0) {

        //if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        if (message.channel.type !== 'text') return;


        const description = message.cleanContent || "message had no content"
        const descriptionfix = description.substr(0, 600);
        const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(message.author.avatarURL)
            .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
            .addField("Message Content:", `${descriptionfix}`)
            .setTimestamp()
            .setFooter("Message delete in " + message.channel.name);
        client.channels.cache.get(config.DiscordBot.mLogs).send({ embed });

    }

    if (message.author.bot || !message.content) return;

    let data = {
        message: message.content,
        member: message.member,
        timestamp: Date.now(),
        action: "delete"
    };

    if (messageSnipes.get(message.channel.id) == null) messageSnipes.set(message.channel.id, [data])
    else messageSnipes.set(message.channel.id, [...messageSnipes.get(message.channel.id), data]);

    messageSnipes.set(message.channel.id, messageSnipes.get(message.channel.id).filter(x => (Date.now() - x.timestamp) < 300000 && x != null));

};