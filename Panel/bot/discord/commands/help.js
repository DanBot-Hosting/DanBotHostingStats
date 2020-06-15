const Help = {
    "Users": `${config.DiscordBot.Prefix}getstarted | Create a server or account \n${config.DiscordBot.Prefix}link | Link your console account with your discord account \n${config.DiscordBot.Prefix}linked | Check if your account is linked \n${config.DiscordBot.Prefix}stats | Shows the stats of each hosting node. \n${config.DiscordBot.Prefix}ticket | Create a ticket for help from the staff team! \n${config.DiscordBot.Prefix}status | Check the status of your server! \n${config.DiscordBot.Prefix}uptime | Shows the bots uptime \n${config.DiscordBot.Prefix}changelog | Check the changelog for the github commit. \n${config.DiscordBot.Prefix}radio | Joins VC and plays DanBot Radio.`,
    "Staff": `${config.DiscordBot.Prefix}staff | Gets the ID of a user on console using their discord ID  \n${config.DiscordBot.Prefix}purge | Delete messages in a channel \n${config.DiscordBot.Prefix}access | Gain subuser access to a server`,
    "Owner": `${config.DiscordBot.Prefix}reload | Reloads all commands on the bot \n${config.DiscordBot.Prefix}restart | Restarts **EVERYTHING**, Bot and Stats website \n${config.DiscordBot.Prefix}say | Says what you want it to say \n${config.DiscordBot.Prefix}eval | Eval some code \n${config.DiscordBot.Prefix}exec | Run some system commands \n${config.DiscordBot.Prefix}giveaway | Launch a giveaway`
}

exports.run = async (client, message, args) => {
    if (message.member.roles.find(r => r.name === "Staff")) {
    let embed = new Discord.RichEmbed()
        .setColor(`BLUE`)
        .addField(`__**Commands List for users:**__`, Help.Users)
        .addField(`__**Staff Commands:**__`, Help.Staff)
    message.channel.send(embed)
    } else if (message.member.roles.find(r => r.name === "Owner")) {
    let embed = new Discord.RichEmbed()
        .setColor(`BLUE`)
        .addField(`__**Commands List for users:**__`, Help.Users)
        .addField(`__**Staff Commands:**__`, Help.Staff)
        .addField(`__**Owner Commands:**__`, Help.Owner)
    message.channel.send(embed)
    } else if (message.member.roles.find(r => r.name === "Members")) {
    let embed = new Discord.RichEmbed()
        .setColor(`BLUE`)
        .addField(`__**Commands List for users:**__`, Help.Users)
    message.channel.send(embed)
    };
};