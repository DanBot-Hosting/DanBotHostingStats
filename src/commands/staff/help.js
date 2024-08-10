const Discord = require('discord.js');

const Config = require('../../../config.json');

const subcommands = {
    mods: {
        premiumfix: [
            "Fixes a user's premium count if it's incorrect.",
            "<USER_ID || USER_MENTION>",
        ],
        proxyfix: ["Attmpts to delete a proxy from one of the servers.", "<DOMAIN_NAME>"],
        transfer: ["Transfer data from one user account to another.", "<OLDUSERID> <NEWUSERID>"],
    },
    admin: {
        lockdown: ["Allows the channel to be locked or unlocked.", ""],
        linked: ["Check the details for a user account.", ""],
    },
    botdev: {
        linked: ["Shows if the users account is linked.", "<userid>"],
        maintenance: ["Set a Node into maintenance for Node Status.", "<nodeName>"],
        update: ["Pulls files from GitHub manaully.", ""],
        changelog: ["Announce new changes to the changelog channel.", "<MESSAGE>"],
    },
    misc: {
        premium: [
            "Set, add, or remove premium servers from a user.",
            "<set||add||remove> <user> <amount>",
        ],
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
            `**${subCommand}** - ${desc}\n (\`${config.DiscordBot.Prefix + "staff " + subCommand + " " + usage}\`)`,
        );
    }
    return description;
};

exports.description = "Shows staff commands."

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .addField("**Moderator Commands:**", desc(subcommands.mods).join("\n"))
        .addField("**Administrator Commands:**", desc(subcommands.admin).join("\n"))
        .addField("**Bot Developer Commands:**", desc(subcommands.botdev).join("\n"))
        .addField("**Misc Commands:**", desc(subcommands.misc).join("\n"));
        
    await message.reply(embed);
};
