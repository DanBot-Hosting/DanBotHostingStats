exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041751099539497")) return;

    if (args[1] == null) {
        message.channel.send('Please send a users discord ID to see if they are linked with an account on the host.')
    } else {
        if (userData.get(args[1]) == null) {
            message.channel.send("That account is not linked with a console account :sad:")
        } else {
            console.log(userData.fetch(args[1]))
            let embed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .addField(`__**Username**__`, userData.fetch(args[1] + ".username"))
                .addField(`__**Email**__`, userData.fetch(args[1] + ".email"))
                .addField(`__**Discord ID**__`, userData.fetch(args[1] + ".discordID" + "( https://panel.danbot.host/admim/users/view/" + userData.fetch(args[1] + ".discordID") + ")"))
                .addField(`__**Console ID**__`, userData.fetch(args[1] + ".consoleID"))
                .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(args[1] + ".linkDate"))
                .addField(`__**Time**__`, userData.fetch(args[1] + ".linkTime")) 
            await message.channel.send('That account is linked. Heres some data: ', embed)
        }
    }
}
