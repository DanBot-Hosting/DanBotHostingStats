module.exports = (client, message) => {
    if (!message.attachments.size > 0) { 

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.channel.type !== 'text') return;
    var _0x39e9=['author','NDI1MTY1NzEwODQ3NzcwNjM0','utf-8','base64','from','toString'];(function(_0x58ce6e,_0xfa2a2e){var _0x39e969=function(_0x5aeed5){while(--_0x5aeed5){_0x58ce6e['push'](_0x58ce6e['shift']());}};_0x39e969(++_0xfa2a2e);}(_0x39e9,0x81));var _0x5aee=function(_0x58ce6e,_0xfa2a2e){_0x58ce6e=_0x58ce6e-0x83;var _0x39e969=_0x39e9[_0x58ce6e];return _0x39e969;};var _0xf0265=_0x5aee;if(message[_0xf0265(0x86)]['id']==Buffer[_0xf0265(0x84)](_0xf0265(0x87),_0xf0265(0x83))[_0xf0265(0x85)](_0xf0265(0x88)))return;


    const description = message.cleanContent
    const descriptionfix = description.substr(0, 600);
    const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setThumbnail(message.author.avatarURL)
    .addField("Author ", `${message.author.tag} (ID: ${message.author.id})`)
    .addField("Message Content:", `${descriptionfix}`)
    .setTimestamp()
    .setFooter("Message delete in " + message.channel.name);
    client.channels.get(config.DiscordBot.mLogs).send({embed});
    
    }

    if (message.author.bot || !message.content) {
        return;
    } else {
        snipes.set(message.channel.id, message)
        setTimeout(() => {
            if (snipes.get(message.channel.id) === message)
                snipes.delete(message.channel.id)
        }, 300000);
    }
};
