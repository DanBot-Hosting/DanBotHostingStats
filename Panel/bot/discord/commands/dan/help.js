exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "639489438036000769")) return;

    const embed = new Discord.MessageEmbed()
        .setTitle('Dan\/s Commands \n`' +
        config.DiscordBot.Prefix + 'dan screenshot` Screenshot a domain \n`' +
        config.DiscordBot.Prefix + 'dan google` Screenshot a search result on google \n`' +
        config.DiscordBot.Prefix + 'dan google-images` Screenshot google images')

    await message.channel.send(embed)
}