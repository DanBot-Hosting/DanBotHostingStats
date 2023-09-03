module.exports = (client, message) => {
    if (!message.attachments.size > 0 && message.channel.type === "text" && message.author) {
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
};
