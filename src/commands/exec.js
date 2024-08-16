const Discord = require("discord.js");
const exec = require("child_process").exec;

const Config = require("../../config.json");

exports.roleRequirement = Config.DiscordBot.Roles.BotAdmin;
exports.description = "Wykonuje komendy w terminalu.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = (client, message, args) => {
    if (
        ["286178186645995522", "836972435550896139", "1050456185637179412"].includes( // smutex, wojtoteka, fafik
            message.author.id,
        )
    ) {
        exec(`${args.join(" ")}`, (error, stdout) => {
            let response = error || stdout;

            if (response.length > 4000) console.log(response), (response = "Zbyt duża odpowiedź.");

            message.reply("", {
                embed: new Discord.MessageEmbed()
                    .setDescription("```" + response + "```")
                    .setTimestamp()
                    .setColor("RANDOM"),
            });
        });
    }
};