exports.run = async (client, message, args) => {
    if (args.length < 2) {
        message.channel.send("usage: `DBH!vc <<add | remove> <@user | userID>`")
    }

    if (args[0].toLowerCase() == "add") {
        if (bot.pvc.get(message.member.voiceChannelID) && bot.pvc.get(message.member.voiceChannelID).owner == message.member.id) {
            let member = message.guild.members.get(args[1].match(/[0-9]{18}/)[0])

            if (member == null) {
                message.reply("Couldn't find that user.")
                return;
            }

            message.member.voiceChannel.overwritePermissions(member, {
                CONNECT: true,
                VIEW_CHANNEL: true,
                STREAM: true,
                SPEAK: true
            });

            message.reply("successfully added **" + member.user.username + "** to the Voice Channel.")

        } else {
            message.reply("You must be in a channel that you own in order to use this command.")
        }
    }
    if (args[0].toLowerCase() == "remove") {
        if (bot.pvc.get(message.member.voiceChannelID) && bot.pvc.get(message.member.voiceChannelID).owner == message.member.id) {

            let member = message.guild.members.get(args[1].match(/[0-9]{18}/)[0])

            if (member == null) {
                message.reply("Couldn't find that user.")
                return;
            }

            if (member.hasPermission("ADMINISTRATOR")) {
                message.reply("can't remove **" + member.user.username + "** from the Voice Channel.")
                return;
            }

            message.member.voiceChannel.overwritePermissions(member, {
                CONNECT: false,
                VIEW_CHANNEL: false
            });
            member.setVoiceChannel(null);
            message.reply("successfully removed **" + member.user.username + "** from the Voice Channel.")


        } else {
            message.reply("You must be in a channel that you own in order to use this command.")
        }
    }
}