exports.run = async (client, message, args) => {
    if (message.member.roles.cache.find(r => r.id === "898041743566594049")) {
        let embed = new Discord.MessageEmbed()
            .addField('__**Staff Applications Enabled?**__', webSettings.fetch("staff-applications.enabled"), true)
            .addField('__**Website maintenance enabled?**__', webSettings.fetch("maintenance.enabled"), true)
        await message.channel.send(embed)
    }
}