module.exports = (client, message) => {
    if (!message.attachments.size > 0) {
        //if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (message.channel.type !== "text") return;
        if (message.author == null) return;

        const description = message.cleanContent || "*No message content*";
        const descriptionfix = description.substr(0, 600);
        const embed = new Discord.MessageEmbed()
            .setColor(0x00a2e8)
            .setThumbnail(message.author.avatarURL)
            .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
            .addField("Message Content:", `${descriptionfix}`)
            .setTimestamp()
            .setFooter("Message delete in " + message.channel.name)
            .setImage(message.attachments.first() ? message.attachments.first().proxyURL : null);
        client.channels.cache.get(config.DiscordBot.mLogs).send({
            embed,
        });
    }

    if (message.author.bot || !message.content) return;
};
