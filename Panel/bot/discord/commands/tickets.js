exports.run = async (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');

    if (args == "") {
        let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Tickets**__`, `Create a new ticket: ${config.DiscordBot.Prefix}ticket new \nNeed to close a ticket? ${config.DiscordBot.Prefix}ticket close`, true);
        message.channel.send(embed)
    }
};