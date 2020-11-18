const Discord = require('discord.js')
const commands = {
    Users: {
        user: "See help for that command.",
        server: "See help for that command.",
        stats: "Shows the stats of each hosting node.",
        ticket: "Create a ticket for help from the staff team!.",
        uptime: "Shows the bots uptime.",
        vc: "Manage you custom voice channel.",
        info: "Get a bots info.",
        suggest: "Get the link to send in suggestions.",
        animalapi: "Check out our animal api."
    },
    Staff: {
        staff: "See help for that command.",
        purge: "Delete messages in a channel.",
        mute: "Mute da user .",
        kick: "Kick da user."
    },
    Owner: {
        reload: "Reloads all commands on the bot.",
        'staff update': "Pull latest git commit.",
        say: "Says what you want it to say.",
        eval: "Eval some code.",
        exec: "Run some system commands.",
        giveaway: "Launch a giveaway.",
        announce: "Announce something."
    }
}

let desc = (object) => {
    let description = [];
    let entries = Object.entries(object);
    for (const [command, desc] of entries) {
        description.push(`**${config.DiscordBot.Prefix}${command}** - ${desc}`)
    }
    return description;
}

exports.run = async (client, message, args) => {

    let embed = new Discord.RichEmbed()
        .setColor('BLUE')
        .addField(`__**Users:**__ (${Object.entries(commands.Users).length})`, desc(commands.Users).join('\n'))

    if (message.member.roles.get('748117822370086932') != null)
        embed.addField(`__**Staff Commands:**__ (${Object.entries(commands.Staff).length})`, desc(commands.Staff).join('\n'))

    if (message.member.roles.find(r => r.id === "778237595477606440"))
        embed.addField(`__**Developer Commands:**__ (${Object.entries(commands.Owner).length})`, desc(commands.Owner).join('\n'))

    message.channel.send(embed)
};