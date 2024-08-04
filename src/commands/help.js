const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");

let getCommandDescriptions = (dir) => {
    let categories = [];
    let commands = [];
    try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                categories.push(`**${config.DiscordBot.Prefix}${item}** - Use ${config.DiscordBot.Prefix}${item} for more information.`);
            } else if (item.endsWith('.js')) {
                const command = require(itemPath);
                commands.push({
                    name: item.replace('.js', ''),
                    description: command.description || "No description available."
                });
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }
    return { categories, commands };
};

exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setTitle("Commands:")
        .setColor("BLUE");

    const commandDir = path.join(__dirname);
    const { categories, commands } = getCommandDescriptions(commandDir);

    if (categories.length > 0) {
        categories.unshift('----------------------------------------------------------');
        categories.push('----------------------------------------------------------');
        embed.setDescription(categories.join("\n"));
    } else {
        embed.setDescription("No subcommands available.");
    }

    commands.forEach(command => {
        embed.addField(
            `**${config.DiscordBot.Prefix}${command.name}**`,
            command.description
        );
    });

    if (commands.length === 0) {
        embed.addField("\u200B", "No commands available.");
    }

    message.reply(embed);
};

exports.description = "Shows the commands available for the bot.";