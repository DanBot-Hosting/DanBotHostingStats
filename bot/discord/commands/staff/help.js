let subcommands = {
    mods: {
        lockdown: ["Allows the channel to be locked or unlocked", ''],
        node: ["Restarts the node if it is down", '']
    },
    admin: {
        linked: ["Shows if the users account is linked.", 'linked <USERID>'],
        apply: ["Manage Staff applications.", '<open/close>'],
        settings: ["Shows current website settings.", ''],
        reactionroles: ["Reloads all reactionRoles.", '']
    },
    devs: {
        maintenance: ["Enable or disable website maintenance.", '<on/off>'],
        update: ["Pulls updates from GitHub.", ''],
        wings: ["Manage the wings of a specific node.", '<NodeID> <Start | Restart | Stop>']
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

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041751099539497")) return;

    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .addField('**Admin Commands:**', desc(subcommands.admin).join('\n'))
        .addField('**Owner Commands:**', desc(subcommands.devs).join('\n'))
    await message.channel.send(embed)
}