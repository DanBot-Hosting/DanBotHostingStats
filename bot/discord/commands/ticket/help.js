exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setColor(`GREEN`)
        .addField(`__**Tickets**__`, 'You can create a new ticket by typing: `' +
            config.DiscordBot.Prefix + 'ticket new` \nYou can download your old tickets by running: `' +
            config.DiscordBot.Prefix + 'ticket logs` \nYou can close your ticket by running: `' +
            config.DiscordBot.Prefix + 'ticket close` \nYou can upgrade your ticket by running:`' +
            config.DiscordBot.Prefix + 'ticket upgrade` \n\nAny problems? Please send a message in <#739231758087880845> and someone will help you.', true);
    await message.channel.send(embed)
}
