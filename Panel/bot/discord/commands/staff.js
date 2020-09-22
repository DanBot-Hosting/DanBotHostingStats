exports.run = async (client, message, args) => {
    if (!args[0]) {
        let embed = new Discord.RichEmbed()
            .setColor('RANDOM')
            .addField('**Staff Commands:**', config.DiscordBot.Prefix + "staff linked useridhere | Shows if the users account is linked.")
        message.channel.send(embed)
    } else if (message.content.toLowerCase().includes("linked")) {
        if (args[1] === "") {
            message.channel.send('Please send a users discord ID to see if they are linked with an account on the host.')
        } else {
            if (userData.get(args[1]) == null) {
                message.channel.send("That account is not linked with a console account :sad:")
            } else {
                console.log(userData.fetch(args[1]))
                let embed = new Discord.RichEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Username**__`, userData.fetch(args[1] + ".username"))
                    .addField(`__**Email**__`, userData.fetch(args[1] + ".email"))
                    .addField(`__**Discord ID**__`, userData.fetch(args[1] + ".discordID"))
                    .addField(`__**Console ID**__`, userData.fetch(args[1] + ".consoleID"))
                    .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(args[1] + ".linkDate"))
                    .addField(`__**Time**__`, userData.fetch(args[1] + ".linkTime"))
                message.channel.send('That account is linked. Heres some data: ', embed)
            }
        }
    } else if (message.content.toLowerCase().includes("createserver")) {
        message.channels.send('Who would you like to create')
    }
}