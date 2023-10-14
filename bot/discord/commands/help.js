const Discord = require("discord.js");
const commands = {
    Users: {
        user: "See help for that command.",
        server: "See help for that command.",
        ping: "Shows the bots ping.",
        ticket: "Create a ticket for help from the staff team!",
        uptime: "Shows the bots uptime.",
        domains: "Show all of your linked domains.",
        links: "Show links to some DBH sites.",
        help: "Brings up this menu.",
    },
    Staff: {
        staff: "See help for that command."
    },
    Owner: {
        eval: "Eval some code.",
        exec: "Run some system commands.",
    },
};

let desc = (object) => {
    let description = [];
    let entries = Object.entries(object);
    for (const [command, desc] of entries) {
        description.push(`**${config.DiscordBot.Prefix}${command}** - ${desc}`);
    }
    return description;
};

exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .addField(`__**Users:**__ (${Object.entries(commands.Users).length})`, desc(commands.Users).join("\n"));

    if (message.member.roles.cache.get("898041751099539497") != null)
        embed.addField(
            `__**Staff Commands:**__ (${Object.entries(commands.Staff).length})`,
            desc(commands.Staff).join("\n")
        );

    if (message.member.roles.cache.find((r) => r.id === "898041743566594049"))
        embed.addField(
            `__**Developer Commands:**__ (${Object.entries(commands.Owner).length})`,
            desc(commands.Owner).join("\n")
        );

    message.reply(embed);
};
