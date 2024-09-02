const Discord = require("discord.js");
const exec = require("child_process").exec;

const Config = require("../../config.json");
const MiscConfigs = require('../../config/misc-configs.js');

exports.roleRequirement = Config.DiscordBot.Roles.BotAdmin;
exports.description = "Runs terminal commands.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = (client, message, args) => {
    if (
        MiscConfigs.botCommands.includes(
            message.author.id,
        )
    ) {

        if (args.length == 0) return message.reply({ content: "Please provide a command to run."});

        exec(`${args.join(" ")}`, (error, stdout) => {
            let response = error || stdout;

            if (response.length > 4000) console.log(response), (response = "Output too long.");

            const Embed = new Discord.EmbedBuilder()
                .setDescription("```" + response + "```")
                .setTimestamp()
                .setColor("Blurple")

            message.reply({embeds: [Embed]});
        });
    }
};