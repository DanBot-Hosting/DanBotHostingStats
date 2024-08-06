const Discord = require("discord.js");
const exec = require("child_process").exec;

const Config = require("../../config.json");

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
        ["137624084572798976", "757296951925538856", "853158265466257448"].includes(
            message.author.id,
        )
    ) {
        exec(`${args.join(" ")}`, (error, stdout) => {
            let response = error || stdout;

            if (response.length > 4000) console.log(response), (response = "Output too long.");

            message.reply("", {
                embed: new Discord.MessageEmbed()
                    .setDescription("```" + response + "```")
                    .setTimestamp()
                    .setColor("RANDOM"),
            });
        });
    }
};