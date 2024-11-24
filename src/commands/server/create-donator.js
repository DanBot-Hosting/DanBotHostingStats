const Discord = require('discord.js');
const Config = require('../../../config.json');
const serverCreateSettings_Prem = require("../../../createData_Prem");

exports.description = "Creates a donator server. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let userP = await userPrem.get(message.author.id) || {
        used: 0,
        donated: 0,
    };

    const serverName =
        message.content.split(" ").slice(3).join(" ") ||
        "Untitled Server (settings -> server name)";

    let consoleID = await userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
                "If you have not made an account yet please check out `" +
                Config.DiscordBot.Prefix +
                "user new` to create an account\nIf you already have an account link it using `" +
                Config.DiscordBot.Prefix +
                "user link`",
        );
        return;
    }

    let allowed = Math.floor(userP.donated / Config.PremiumServerPrice);

    let pServerCreatesettings = serverCreateSettings_Prem.createParams(
        serverName,
        consoleID.consoleID,
    );

    if (allowed === 0) {
        message.reply("You do not have enough donations to create a server.");
        return;
    }

    const type = args[1].toLowerCase();
    if (!Object.keys(serverCreateSettings_Prem.serverTypes).includes(type)) {
        message.reply("Invalid server type.");
        return;
    }

    serverCreateSettings_Prem.createServer(pServerCreatesettings[type])
        .then((response) => {
            const embed = new Discord.EmbedBuilder()
                .setColor(`Green`)
                .addFields(
                    { name: "__**Status:**__", value: response.statusText.toString(), inline: false },
                    { name: "__**Created for user ID:**__", value: consoleID.consoleID.toString(), inline: false },
                    { name: "__**Server name:**__", value: serverName.toString(), inline: false },
                    { name: "__**Type:**__", value: type.toString(), inline: false }
                );

            message.reply({ embeds: [embed] });
        })
        .catch(async (error) => {
            const ErrorEmbed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });

            ErrorEmbed.setTitle("Error: Failed to Create a New Server");
            ErrorEmbed.setDescription(`Some other issue happened. If this continues please open a ticket and report this to a <@&${Config.DiscordBot.Roles.BotAdmin}> Please share this info with them: \n\n` + "```Error: " + error + "```");

            await message.reply({ embeds: [ErrorEmbed] });
        });
};