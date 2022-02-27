exports.run = async(client, message, args) => {
        const AllowedChannels = [
    898041850890440725, //Normal Commands.
    898041851729305621, //Spam.
    898041866589700128, //Donator/Booster Commands.
    898041878447013948, //Beta Commands.
    ];   

    if(!AllowedChannels.some(c => c == message.channel.id)) return;  

    let embed = new Discord.MessageEmbed()
        .addField('__**Commands**__', 'Create a server: `' +
            config.DiscordBot.Prefix + 'server create <type> <servername>` \nCreate a premium server: `' +
            config.DiscordBot.Prefix + 'server create-donator <type> <servername>` \nServer Types: `' +
            config.DiscordBot.Prefix + 'server create list` \nServer Redeem: `' +
            config.DiscordBot.Prefix + 'server redeem <code>` \nServer Status: `' +
            config.DiscordBot.Prefix + 'server status <serverid>` \nLink Domain: `' +
            config.DiscordBot.Prefix + 'server proxy <domainhere> <serveridhere> ` \n Unlink domain: `' +
            config.DiscordBot.Prefix + 'server unproxy <domainhere>` \n Delete server: `' +
            config.DiscordBot.Prefix + 'server delete <serveridhere>` \n List servers:' +
            config.DiscordBot.Prefix + 'server list`' +)
    await message.channel.send(embed)
}
