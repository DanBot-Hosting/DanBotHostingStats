const Discord = require('discord.js');
const Config = require('../../../config.json');

const PremiumCreation = require("../../../createData_Prem");
const MiscConfigs = require("../../../config/misc-configs.js");

exports.description = "Creates a donator server. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const UserPremium = await userPrem.get(message.author.id);

    if (UserPremium == null) {
        await userPrem.set(message.author.id, {donated: 0, used: 0});

        return await message.reply("Retry the command.");
    };

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

    const allowed = Math.floor(UserPremium.donated / Config.PremiumServerPrice);

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
          .setFooter({ text: "Example: " + Config.DiscordBot.Prefix + "server create-donator aio My AIO Server", iconURL: client.user.displayAvatarURL() })
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
      
    const HelpEmbed = GenerateHelpEmbed(PremiumCreation.serverTypes);
    
    if (!args[1]) {
        return await message.reply({ embeds: [HelpEmbed] });
    };

    if (allowed === 0) {
        return await message.reply("You do not have enough donations to create a server.");
    }

    const ServerType = args[1].toLowerCase();

    if (!Object.keys(PremiumCreation.serverTypes).includes(ServerType)) {
        return await message.reply({ embeds: [HelpEmbed] });
    };

    if (PremiumCreation.serverTypes[ServerType].isDisabled) {
        return await message.reply("This server type is currently disabled.");
    };

    const ServerCreationSettings = PremiumCreation.createParams(
        ServerName,
        ServerType,
        userAccount.consoleID
    );

    PremiumCreation.createServer(ServerCreationSettings)
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
                    { name: "__**Server Name:**__", value: ServerName.toString(), inline: false },
                    { name: "__**Slots Used:**__", value: `(` + UserPremiumNew.used + ` slots / ` + allowed + ` slots)`, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });

            await message.reply({ embeds: [Embed] });

            
            const CreationLog = new Discord.EmbedBuilder()
                .setTitle("New donator node server created!")
                .setColor("Green")
                .addFields(
                    { name: "User:", value: message.author.id.toString(), inline: false },
                    { name: `Status`, value: Response.statusText.toString(), inline: false},
                    { name: `Created for user ID`, value: userAccount.consoleID.toString(), inline: false},
                    { name: `Server name`, value: ServerName.toString(), inline: false },
                    { name: `Type`, value: args[1].toLowerCase().toString(), inline: false }
                )
                .setTimestamp()
                .setFooter(
                    { text: "User has " + (UserPremiumNew.used) + " out of a max " + allowed + " servers", iconURL: client.user.displayAvatarURL() }
                );

            await client.channels.cache.get(MiscConfigs.donatorlogs).send({embeds: [CreationLog]});
        })
        .catch(async (Error) => {
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTimestamp()
                .setFooter({'text': "Command Executed By: " + message.author.username + ` (${message.author.id})`, "iconURL": message.author.avatarURL()})


            if (Error == "AxiosError: Request failed with status code 400") {

                    ErrorEmbed.setTitle("Error: Failed to Create a New Server")
                    ErrorEmbed.setDescription("The Node is currently full, Please check <#" + MiscConfigs.serverStatus + "> for updates.\n\nIf there is no updates please alert a System Administrator (<@&" + Config.DiscordBot.Roles.SystemAdmin + ">)")

            } else if (Error == "AxiosError: Request failed with status code 504") {

                    ErrorEmbed.setTitle("Error: Failed to Create a New Server")
                    ErrorEmbed.setDescription("The Node is currently offline or having issues, You can check the status of the node in this channel: <#" + MiscConfigs.serverStatus + ">")

            } else if (Error == "AxiosError: Request failed with status code 429") {

                    ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                    ErrorEmbed.setDescription("You are being rate limited, Please wait a few minutes and try again.");
        
            } else {

                    ErrorEmbed.setTitle("Error: Failed to Create a New Server");
                    ErrorEmbed.setDescription(`Some other issue happened. If this continues please open a ticket and report this to a <@&${Config.DiscordBot.Roles.BotAdmin}> Please share this info with them: \n\n` + "```Error: " + Error + "```");
            }

            //Catch statement added incase of message being deleted before response is sent.
            await message.reply({embeds: [ErrorEmbed]}).catch(Error => {});
        });
};