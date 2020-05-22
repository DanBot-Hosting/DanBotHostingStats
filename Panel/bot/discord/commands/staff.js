exports.run = async (client, message, args) => {
    //const args = message.content.split(' ').slice(1).join(' ');
    //const args2 = message.content.split(' ').slice(3).join(' ');

    if (message.content.toLowerCase().includes("linked")) {
        if (args.slice(0).join(" ") == "") {
            message.channel.send('Please send a users discord ID to see if they are linked with an account on the host.')
        } else {
            if (userData.get(args.slice(1).join(" ")) == null) {
                message.channel.send("That account is not linked with a console account :sad:")
            } else  {
                let embed = new Discord.RichEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Username**__`, userData.fetch(args.slice(1).join(" ") + ".username"))
                    .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(args.slice(1).join(" ") + ".linkDate"))
                    .addField(`__**Time**__`, userData.fetch(args.slice(1).join(" ") + ".linkTime"))
                message.channel.send('That account is linked. Heres some data: ', embed)
            }
        }
    } else if (message.content.toLowerCase().includes("createserver")) {
        message.channels.send('Who would you like to create')
    }
}