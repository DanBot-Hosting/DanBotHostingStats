const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");
const Config = require('../../config.json');


exports.description = "Pokazuje dotępne polecenia bota.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Komendy:")
        .setColor("BLUE");

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
                categories.push(`**${config.DiscordBot.Prefix}${item}** - Użyj ${config.DiscordBot.Prefix}${item} po więcej informacji.`);
                // If the item is a JavaScript file, it's a command.
            } else if (item.endsWith('.js')) {
                const command = require(itemPath);

                // Check role requirement
                if (!command.roleRequirement || memberRoles.includes(command.roleRequirement)) {
                    commands.push({
                        name: item.replace('.js', ''),
                        description: command.description || "Brak opisu."
                    });
                }
            }
        });
    } catch (error) {
        console.error(`Wystąpił błąd w czytaniu katalogu ${commandDir}:`, error);
    }

    if (categories.length > 0) {
        categories.push('``` ```');
        embed.setDescription(categories.join("\n"));
    } else {
        embed.setDescription("Brak subkomend.");
    }

    commands.forEach(command => {
        embed.addField(
            `**${config.DiscordBot.Prefix}${command.name}**`,
            command.description
        );
    });

    if (commands.length === 0) {
        embed.addField("\u200B", "Brak komend.");
    }

    message.reply(embed);
};