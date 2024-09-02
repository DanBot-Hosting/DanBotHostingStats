const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");
const Config = require('../../config.json');


exports.description = "Shows the commands available for the bot.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let embed = new Discord.EmbedBuilder()
        .setTitle("Commands:")
        .setColor("Blue");

    let categories = [];
    let commands = [];
    const commandDir = path.join(__dirname);
    const memberRoles = message.member.roles.cache.map(role => role.id);

    try {
        // Reads all the items in the directory.
        const items = fs.readdirSync(commandDir);

        // Loops through each item in the directory.
        items.forEach(item => {
            const itemPath = path.join(commandDir, item);

            // If the item is a directory, it's a sub command category.
            if (fs.statSync(itemPath).isDirectory()) {
                if (item === 'staff' && !memberRoles.includes(Config.DiscordBot.Roles.Staff)) {
                    return; // Skip this category if the user doesn't have the staff role
                }
                categories.push(`**${Config.DiscordBot.Prefix}${item}** - Use ${Config.DiscordBot.Prefix}${item} for more information.`);
            // If the item is a JavaScript file, it's a command.
            } else if (item.endsWith('.js')) {
                const command = require(itemPath);

                // Check role requirement
                if (!command.roleRequirement || memberRoles.includes(command.roleRequirement)) {
                    commands.push({
                        name: item.replace('.js', ''),
                        description: command.description || "No description available."
                    });
                }
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${commandDir}:`, error);
    }

    if (categories.length > 0) {
        categories.push('``` ```');
        embed.setDescription(categories.join("\n"));
    } else {
        embed.setDescription("No subcommands available.");
    }

    commands.forEach(command => {
        embed.addFields(
            { name: `**${Config.DiscordBot.Prefix}${command.name}**`, value: command.description}
        );
    });

    if (commands.length === 0) {
        embed.addFields(
            { name: "\u200B", value: "No commands available."}
        );
    }

    message.reply({ embeds: [embed] });
};