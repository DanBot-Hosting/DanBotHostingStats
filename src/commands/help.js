const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const Config = require("../../config.json");

exports.description = "Shows the commands available for the bot.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  const commandDir = path.join(__dirname);
  const memberRoles = message.member.roles.cache.map((role) => role.id);

  let categories = [];
  let commands = [];

  try {
    // Reads all the items in the directory.
    const items = fs.readdirSync(commandDir);

    // Loops through each item in the directory.
    items.forEach((item) => {
      const itemPath = path.join(commandDir, item);

      // If the item is a directory, it's a sub command category.
      if (fs.statSync(itemPath).isDirectory()) {
        if (
          item === "staff" &&
          !memberRoles.includes(Config.DiscordBot.Roles.Staff)
        ) {
          return; // Skip this category if the user doesn't have the staff role
        }
        categories.push(item);
      } else if (item.endsWith(".js")) {
        const command = require(itemPath);

        // Check role requirement
        if (
          !command.roleRequirement ||
          memberRoles.includes(command.roleRequirement)
        ) {
          commands.push({
            name: item.replace(".js", ""),
            description: command.description || "No description available.",
          });
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${commandDir}:`, error);
  }

  let embeds = [];

  // Create an embed for each category
  categories.forEach((category) => {
    let embed = new Discord.EmbedBuilder()
      .setTitle(`📜 ${category} Commands`)
      .setColor("Blue")
      .setFooter({ text: "Use the prefix before each command." })
      .setTimestamp();

    embed.addFields({
      name: "Category",
      value: `**${Config.DiscordBot.Prefix}${category}** - Use ${Config.DiscordBot.Prefix}${category} for more information.`,
      inline: false,
    });

    embeds.push(embed);
  });

  // Create an embed for commands
  if (commands.length > 0) {
    let commandEmbed = new Discord.EmbedBuilder()
      .setTitle("📜 Bot Commands")
      .setColor("Blue")
      .setFooter({ text: "Use the prefix before each command." })
      .setTimestamp();

    commands.forEach((command) => {
      commandEmbed.addFields({
        name: `**${Config.DiscordBot.Prefix}${command.name}**`,
        value: command.description,
        inline: false,
      });
    });

    embeds.push(commandEmbed);
  } else {
    let commandEmbed = new Discord.EmbedBuilder()
      .setTitle("📜 Bot Commands")
      .setColor("Blue")
      .setFooter({ text: "Use the prefix before each command." })
      .setTimestamp()
      .addFields({
        name: "\u200B",
        value: "No commands available.",
        inline: false,
      });

    embeds.push(commandEmbed);
  }

  message.reply({ embeds: embeds });
};
