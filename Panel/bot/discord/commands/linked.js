exports.run = async (client, message) => {
    let result = userData.get(message.author.id)
    if (userData.get(message.author.id) == null) {
        message.channel.send("You'r account is not linked. Please link you'r account using " + config.DiscordBot.Prefix + "link")
    } else {
        let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
            .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(message.author.id + ".linkDate"))
            .addField(`__**Time**__`, userData.fetch(message.author.id + ".linkTime"))
        message.channel.send('Your account is linked. Heres some data: ', embed)
    }
};