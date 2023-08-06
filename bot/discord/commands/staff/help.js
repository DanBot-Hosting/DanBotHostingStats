let subcommands = {
    mods: {
        lockdown: ["Allows the channel to be locked or unlocked", '']
    },
    admin: {
        linked: ["Shows if the users account is linked.", '<USERID>']
    }
}

let desc = (object) => {
    let description = [];
    let entries = Object.entries(object);
    for (const [subCommand, [desc, usage]] of entries) {
        description.push(`**${subCommand}** - ${desc} (\`${config.DiscordBot.Prefix + "staff " + subCommand + " " + usage}\`)`)
    }
    return description;
}

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041751099539497")) return;

    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .addField('**Admin Commands:**', desc(subcommands.admin).join('\n'))
    await message.channel.send(embed)
}
