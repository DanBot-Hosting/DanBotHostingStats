exports.run = async (client, message) => {
    if (userData.get(message.author.id) == null) {
        message.channel.send("You can't use this command as your account is not linked. You can link it with: `" + config.DiscordBot.Prefix + "link`")
    } else  {
        let consoleUser = await DanBotHosting.getAllServers();
        consoleUser = consoleUser.filter(x => x.attributes.user == userData.fetch(message.author.id + ".consoleID"))

        let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Server's you own:**__`, userData.fetch(message.author.id + ".username"))
        //message.channel.send('Your account is linked. Heres some data: ', embed)
        console.log(consoleUser)
    }
};