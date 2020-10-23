exports.run = async (client, message, args) => {

    //Usage embed
    const usage = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.avatarURL)
    .setTitle("Command: " + config.DiscordBot.Prefix + "mute")
    .addField("Usage", config.DiscordBot.Prefix + "mute @Someone <minutes> <reason>")
    .addField("Example", config.DiscordBot.Prefix + "mute @Someone 5 spamming in general.")
    .setDescription("Description: " + "Gives a user the muted role for x minutes");

    if(message.member.roles.find(r => r.id === "748117822370086932")) { 
        if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_ROLES. :x:')

        //If no user pinged
        if (message.mentions.users.size < 1) return message.channel.send(usage)

        let user = message.guild.member(message.mentions.users.first());
        let messagez = parseInt(args[1])
        if (isNaN(messagez)) return message.channel.send("That is not a valid time")
        if (messagez > 1440) return message.channel.send('Maximum time is 1 day (1440 minutes)');
        if (messagez < 1) return message.channel.send('Time must be at least 1 minute.');
        let reason = args.slice(2).join(' ') || `No reason.`;
        let modlog = message.guild.channels.find(channel => channel.id == config.DiscordBot.mLogs);
        if (reason.length < 1) return;
        let muteRole = client.guilds.get(message.guild.id).roles.find(r => r.id == "726829710935457872");

        //Muted embed
        const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTitle("Action: Mute")
        .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
        .addField("User", user.user.tag + " (ID: " + user.user.id + ")")
        .addField("Time", messagez, true)
        .addField("Reason", reason, true)
        .setFooter("Time used: " + message.createdAt.toDateString())

        message.guild.member(user).addRole(muteRole).then(() => {
            mutesData.set(user.user.id, {
                muted: "true",
                muteTime: Date.now(),
                mutedLength: messagez
            });
            message.channel.send("***The user has been successfully muted for " + messagez + " minute(s) :white_check_mark:***")
        if (!modlog) {
           setTimeout(() => {
           message.guild.member(user).removeRole(muteRole)
           console.log(chalk.magenta('[DISCORD] ') + chalk.cyan(user.user.username + ' has now been unmuted after ' + messagez +' minute(s)'))
           mutesData.delete(user);
           }, messagez * 60000);
          } else {
           client.channels.get(modlog.id).send({embed})
           setTimeout(() => {
           message.guild.member(user).removeRole(muteRole)
           console.log(chalk.magenta('[DISCORD] ') + chalk.cyan(user.user.username + ' has now been unmuted after ' + messagez +' minute(s)'))
           mutesData.delete(user);
           }, messagez * 60000);
          }
        })
      

    } else {
        message.channel.send('Missing perms to do that :(')
    };
};