exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "748117822370086932")) return;
    let modlog = message.guild.channels.cache.find(channel => channel.id === config.DiscordBot.modLogs);

    if (args[1] == null) {
        message.channel.send('usage: DBH!staff transfer <OLDUSERID> <NEWUSERID>.')
    } else {
        if (userData.get(args[1]) == null) {
            message.channel.send("That account is not linked with a console account :sad:")
        } else {

            if (!message.guild.members.cache.get(args[2])) {
                message.channel.send("Couldn't find a user with the ID: " + args[2]);
                return;
            }

            let { donated, used } = userPrem.get(args[1]);
            let newM = userPrem.get(args[2]) || { donated: 0, used: 0 };


            userPrem.set(args[2], { used: used + newM.used, donated: donated + newM.used });

            userPrem.delete(args[1])

            message.channel.send("Done!")

            if (modlog) {
                modlog.send({
                    embed: new Discord.MessageEmbed().setTitle("Premium Balance Transfer")
                        .addField("From:", args[1], true).addField("to:", args[2], true)
                        .setDescription(`Added ${donated} credits and ${used} used`)
                        .setFooter('Executed by: ' + message.author.tag)
                })
            }

        }
    }
}