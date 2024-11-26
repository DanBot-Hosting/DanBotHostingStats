const Discord = require('discord.js');
const Config = require('../../../config.json');
const PremiumCreation = require("../../../createData_Prem");

exports.description = "Creates a donator server. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const UserPremium = await userPrem.get(message.author.id) || {
        used: 0,
        donated: 0,
    };

    // Removes all the other arguments, and joins the strings, then limits it to 150 characters.
    const serverName = message.content.split(" ").slice(3).join(" ").slice(0, 150) + (message.content.split(" ").slice(3).join(" ").length > 150 ? "..." : "") || "Untitled Server (settings -> server name)";

    const userAccount = await userData.get(message.author.id);

    if (userAccount == null) {
        return message.reply(
            "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                Config.DiscordBot.Prefix +
                "user new` to create an account\nIf you already have an account link it using `" +
                Config.DiscordBot.Prefix +
                "user link`",
        );
    }

    const allowed = Math.floor(UserPremium.donated / Config.PremiumServerPrice);

    const HelpEmbed = new Discord.EmbedBuilder();
    HelpEmbed.setColor("Red")
    HelpEmbed.addFields(
        {
            name: "Minecraft",
            value: "Forge\nPaper\nBedrock\nPocketmineMP\nWaterfall\nSpigot",
            inline: true,
        },
        {
            name: "Grand Theft Auto",
            value: "alt:V\nmultitheftauto\nRage.MP\nSA-MP",
            inline: true,
        },
        {
            name: "Languages",
            value: "NodeJS\nBun\nPython\nJava\naio\n Rust (use rustc to create)",
            inline: true,
        },
        {
            name: "Bots",
            value: "redbot",
            inline: true,
        },
        {
            name: "Source Engine",
            value: "GMod\nCS:GO\nARK:SE",
            inline: true,
        },
        {
            name: "Voice Servers",
            value: "TS3\nMumble",
            inline: true,
        },
        {
            name: "SteamCMD",
            value: "Rust\nDaystodie\nAssettocorsa\nAvorion\nBarotrauma",
            inline: true,
        },
        {
            name: "Databases",
            value: "MongoDB\nRedis\nPostgres14\nPostgres16\nMariaDB\nInfluxDB",
            inline: true,
        },
        {
            name: "WebHosting",
            value: "Nginx",
            inline: true,
        },
        {
            name: "Custom Eggs",
            value: "ShareX\nOpenX",
            inline: true,
        },
        {
            name: "Software",
            value: "codeserver\ngitea\nhaste\n uptimekuma\n grafana",
            inline: true,
        }
    )
    HelpEmbed.setFooter({ text: "Example: " + Config.DiscordBot.Prefix + "server create-donator aio My AIO Server", iconURL: client.user.displayAvatarURL() })
    HelpEmbed.setTimestamp();
    
    if (!args[1]) {
        return await message.reply({ embeds: [HelpEmbed] });
    };

    const ServerCreationSettings = PremiumCreation.createParams(
        serverName,
        userAccount.consoleID,
    );

    if (allowed === 0) {
        return await message.reply("You do not have enough donations to create a server.");
    }

    const ServerType = args[1].toLowerCase();

    if (!Object.keys(PremiumCreation.serverTypes).includes(ServerType)) {
        return await message.reply("Invalid server type.");
    }

    PremiumCreation.createServer(ServerCreationSettings[ServerType])
        .then(async (Response) => {

            await userPrem.add(`${message.author.id}.used`, 1);

            const UserPremiumNew = await userPrem.get(message.author.id);

            const Embed = new Discord.EmbedBuilder()
                .setColor(`Green`)
                .setTitle("Server Successfully Created")
                .setDescription(`[Click Here to Access Your Server](${Config.Pterodactyl.hosturl}/server/${Response.data.attributes.identifier})`)
                .addFields(
                    { name: "__**Status:**__", value: Response.statusText.toString(), inline: true },
                    { name: "__**User ID:**__", value: userAccount.consoleID.toString(), inline: true },
                    { name: "__**Type:**__", value: ServerType.toString(), inline: true },
                    { name: "__**Server Name:**__", value: serverName.toString(), inline: false },
                    { name: "__**Slots Used:**__", value: `(` + UserPremiumNew.used + ` slots / ` + allowed + ` slots)`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });


            await message.reply({ embeds: [Embed] });
        })
        .catch(async (Error) => {
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });

            ErrorEmbed.setTitle("Error: Failed to Create a New Server");
            ErrorEmbed.setDescription(`Some other issue happened. If this continues please open a ticket and report this to a <@&${Config.DiscordBot.Roles.BotAdmin}> Please share this info with them: \n\n` + "```Error: " + Error + "```");

            await message.reply({ embeds: [ErrorEmbed] });
        });
};