const Help = {
    "Users": `${config.DiscordBot.Prefix}user | See help for that command \n${config.DiscordBot.Prefix}server | See help for that command \n${config.DiscordBot.Prefix}stats | Shows the stats of each hosting node. \n${config.DiscordBot.Prefix}ticket | Create a ticket for help from the staff team! \n${config.DiscordBot.Prefix}status | Check the status of your server! \n${config.DiscordBot.Prefix}uptime | Shows the bots uptime \n${config.DiscordBot.Prefix}info | Get a bots info. \n ${config.DiscordBot.Prefix}suggest | Get the link to send in suggestions.`,
    "Staff": `${config.DiscordBot.Prefix}staff | See help for that command  \n${config.DiscordBot.Prefix}purge | Delete messages in a channel \n${config.DiscordBot.Prefix}access | Gain subuser access to a server \n${config.DiscordBot.Prefix}mute | Mute da user  \n${config.DiscordBot.Prefix}kick | Kick da user`,
    "Owner": `${config.DiscordBot.Prefix}reload | Reloads all commands on the bot \n${config.DiscordBot.Prefix}restart | Restarts **EVERYTHING**, Bot and Stats website \n${config.DiscordBot.Prefix}say | Says what you want it to say \n${config.DiscordBot.Prefix}eval | Eval some code \n${config.DiscordBot.Prefix}exec | Run some system commands \n${config.DiscordBot.Prefix}giveaway | Launch a giveaway \n${config.DiscordBot.Prefix}announce | Announce something`
}

exports.run = async (client, message, args) => {
    if (message.member.roles.find(r => r.id === "639481606112804875")) {
        let embed = new Discord.RichEmbed()
            .setColor(`BLUE`)
            .addField(`__**Commands List for users:**__`, Help.Users)
            .addField(`__**Staff Commands:**__`, Help.Staff)
            .addField(`__**Owner Commands:**__`, Help.Owner)
        message.channel.send(embed)
    } else if (message.member.roles.find(r => r.id === "748117822370086932")) {
        let embed = new Discord.RichEmbed()
            .setColor(`BLUE`)
            .addField(`__**Commands List for users:**__`, Help.Users)
            .addField(`__**Staff Commands:**__`, Help.Staff)
        message.channel.send(embed)
    } else {
        let embed = new Discord.RichEmbed()
            .setColor(`BLUE`)
            .addField(`__**Commands List for users:**__`, Help.Users)
        message.channel.send(embed)
    };
};

