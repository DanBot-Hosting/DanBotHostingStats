let subcommands = {
    mods: {
        premiumfix: ["Fixes a user's premium count if it's incorrect.", ""],
        proxyfix: ["Attmpts to delete a proxy from one of the servers.", ""],
        transfer: ["Something idk how this command works.", ""],
    },
    admin: {
        lockdown: ["Allows the channel to be locked or unlocked.", ""],
    },
    botdev: {
        linked: ["Shows if the users account is linked.", "<userid>"],
        maintenance: ["Set a Node into maintenance for Node Status.", "<nodeName>"],
        update: ["Pulls files from GitHub manaully.", ""],
    },
    misc: {
        premium: ["Set, add, or remove premium servers from a user.", "<set||add||remove> <user> <amount>"],
        code: ["Create a code that is worth premium servers.", "<codename> <amount>"],
        drop: ["Drops a code within the channel within a certain time.", "<time> <code>"],
        help: ["Pulls up this help menu.", ""],
    },
};

let desc = (object) => {
    let description = [];
    let entries = Object.entries(object);
    for (const [subCommand, [desc, usage]] of entries) {
        description.push(
            `**${subCommand}** - ${desc}\n (\`${config.DiscordBot.Prefix + "staff " + subCommand + " " + usage}\`)`
        );
    }
    return description;
};

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "898041751099539497")) return;

    let embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .addField("**Moderator Commands:**", desc(subcommands.mods).join("\n"))
        .addField("**Administrator Commands:**", desc(subcommands.admin).join("\n"))
        .addField("**Bot Developer Commands:**", desc(subcommands.botdev).join("\n"))
        .addField("**Misc Commands:**", desc(subcommands.misc).join("\n"));
    await message.reply(embed);
};
