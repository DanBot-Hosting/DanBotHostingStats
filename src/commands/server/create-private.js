const Discord = require('discord.js');
const Config = require('../../../config.json');
const MiscConfigs = require("../../../config/misc-configs.js");
const PrivatePanelConfigs = require("../../../config/private-panel-configs.js");
const PrivateCreation = require("../../../createData_Private.js");

exports.description = "Create a server on the private node. Only authorized users can use this command.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    // Check if the user is authorized to use this command
    if (!PrivatePanelConfigs.Users.includes(message.author.id)) {
        return message.reply("You are not authorized to use this command. This command is restricted to private panel users only.");
    }

    // Removes all the other arguments, and joins the strings, then limits it to 150 characters.
    const ServerName = message.content.split(" ").slice(3).join(" ").slice(0, 150) + (message.content.split(" ").slice(3).join(" ").length > 150 ? "..." : "") || "Untitled Server (settings -> server name)";

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

    function GenerateHelpEmbed(Servers) {
        const grouped = {};
      
        for (const [key, value] of Object.entries(Servers)) {
            if (value.isDisabled) continue;
            if (!grouped[value.subCategory]) grouped[value.subCategory] = [];
            grouped[value.subCategory].push(key);
        };
      
        const HelpEmbed = new Discord.EmbedBuilder()
          .setTitle('DanBot Hosting')
          .setColor("Red")
          .setFooter({ text: "Example: " + Config.DiscordBot.Prefix + "server create-private nodejs My Private Server", iconURL: client.user.displayAvatarURL() })
          .setTimestamp();
      
        for (const [category, items] of Object.entries(grouped)) {
            HelpEmbed.addFields({
                name: category,
                value: items.join('\n'),
                inline: true
            });
        }
      
        return HelpEmbed;
    };
      
    const HelpEmbed = GenerateHelpEmbed(PrivateCreation.serverTypes);
    
    if (!args[1]) {
        return await message.reply({ embeds: [HelpEmbed] });
    };

    const ServerType = args[1].toLowerCase();

    if (!Object.keys(PrivateCreation.serverTypes).includes(ServerType)) {
        return await message.reply({ embeds: [HelpEmbed] });
    };

    if (PrivateCreation.serverTypes[ServerType].isDisabled) {
        return await message.reply("This server type is currently disabled.");
    };

    const ServerCreationSettings = PrivateCreation.createParams(
        ServerName,
        ServerType,
        userAccount.consoleID
    );

    PrivateCreation.createServer(ServerCreationSettings)
        .then(async (Response) => {
            const Embed = new Discord.EmbedBuilder()
                .setColor(`Green`)
                .setTitle("Server Successfully Created")
                .setDescription(`[Click Here to Access Your Server](${Config.Pterodactyl.hosturl}/server/${Response.data.attributes.identifier})`)
                .addFields(
                    { name: "__**Status:**__", value: Response.statusText.toString(), inline: true },
                    { name: "__**User ID:**__", value: userAccount.consoleID.toString(), inline: true },
                    { name: "__**Type:**__", value: ServerType.toString(), inline: true },
                    { name: "__**Server Name:**__", value: ServerName.toString(), inline: false }
                )
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });

            await message.reply({ embeds: [Embed] });

            // Log the private server creation
            const CreationLog = new Discord.EmbedBuilder()
                .setTitle("New private node server created!")
                .setColor("Green")
                .addFields(
                    { name: "User:", value: `<@${message.author.id}> (${message.author.id})`, inline: false },
                    { name: "Status:", value: Response.statusText.toString(), inline: false },
                    { name: "Created for user ID:", value: userAccount.consoleID.toString(), inline: false },
                    { name: "Server Name:", value: ServerName.toString(), inline: false },
                    { name: "Type:", value: ServerType.toString(), inline: false }
                )
                .setTimestamp()
                .setFooter({ text: "Private Panel Server Creation", iconURL: client.user.displayAvatarURL() });

            // Log to donator logs channel (or create a private logs channel in config if needed)
            if (MiscConfigs.donatorlogs) {
                await client.channels.cache.get(MiscConfigs.donatorlogs).send({ embeds: [CreationLog] }).catch(() => {});
            }

        }).catch(async (Error) => {
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });

            if (Error == "AxiosError: Request failed with status code 400") {
                ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                ErrorEmbed.setDescription("The private node is currently full or unavailable. Please contact a System Administrator (<@&" + Config.DiscordBot.Roles.SystemAdmin + ">)");

            } else if (Error == "AxiosError: Request failed with status code 504") {
                ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                ErrorEmbed.setDescription("The private node is currently offline or having issues. Please try again later or contact a System Administrator.");

            } else if (Error == "AxiosError: Request failed with status code 429") {
                ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                ErrorEmbed.setDescription("You are being rate limited. Please wait a few minutes and try again.");

            } else {
                ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                ErrorEmbed.setDescription(`An error occurred while creating your server. Please contact a <@&${Config.DiscordBot.Roles.BotAdmin}> and share this info:\n\n` + "```Error: " + Error + "```");
            }

            await message.reply({ embeds: [ErrorEmbed] }).catch(() => {});
        });
};
