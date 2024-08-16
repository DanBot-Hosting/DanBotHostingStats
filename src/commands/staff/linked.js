const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Pokazuje, czy konto jest powiązane.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.BotAdmin)) return;

    if (args[1] == null) {
        message.reply(
            "Proszę podać ID Discorda użytkownika, aby sprawdzić, czy jest powiązany z kontem na hoście.",
        );
    } else {
        if (userData.get(args[1]) == null) {
            message.reply("To konto nie jest powiązane z kontem na konsoli.");
        } else {
            console.log(userData.fetch(args[1]));
            let embed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .addField(`__**Nazwa użytkownika**__`, userData.fetch(args[1] + ".username"))
                .addField(`__**Email**__`, userData.fetch(args[1] + ".email"))
                .addField(`__**ID Discord**__`, userData.fetch(args[1] + ".discordID"))
                .addField(`__**ID konsoli**__`, userData.fetch(args[1] + ".consoleID"))
                .addField(`__**Data (YYYY/MM/DD)**__`, userData.fetch(args[1] + ".linkDate"))
                .addField(`__**Czas**__`, userData.fetch(args[1] + ".linkTime"));
            await message.reply("To konto jest powiązane. Oto niektóre dane: ", embed);
        }
    }
};