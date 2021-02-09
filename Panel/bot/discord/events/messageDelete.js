module.exports = (client, message) => {
    if (!message.attachments.size > 0) { 

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.channel.type !== 'text') return;


    const description = message.cleanContent
    const descriptionfix = description.substr(0, 600);
    const embed = new Discord.MessageEmbed()
    .setColor(0x00A2E8)
    .setThumbnail(message.author.avatarURL)
    .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
    .addField("Message Content:", `${descriptionfix}`)
    .setTimestamp()
    .setFooter("Message delete in " + message.channel.name);
    client.channels.cache.get(config.DiscordBot.mLogs).send({embed});
    
    }

    if (message.author.bot || !message.content) {
        return;
    } else {
        if(snipes.size === 20) {
            snipes.forEach(function(s)) {
                           s.delete(message.channel.id);
        }
        return;
        }
        snipes.set(message.channel.id, message)
    }
};
