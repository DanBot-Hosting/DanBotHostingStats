exports.run = (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');

    if (args == "") {
        let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Tickets**__`, 'You can create a new ticket by typing: `' + config.DiscordBot.Prefix + 'tickets new` \nYou can download your old tickets by running: `' + config.DiscordBot.Prefix + 'tickets logs` \nYou can download your old tickets by running: `' + config.DiscordBot.Prefix + 'tickets logs` \n\nAny problems? Please send a message in <#640158951899398144>', true);
        message.channel.send(embed)

    } else if (args == "new") {

    }
};