const Discord = require("discord.js");
const fs = require("fs");

const Config = require('../../../config.json');

exports.description = "Wyświetla komendy serwera w tej kategorii.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const Embed = new Discord.MessageEmbed();
    Embed.setColor("BLUE");
    Embed.setTitle("Komendy serwera");

    fs.readdirSync(__dirname).forEach((File) => {
        Embed.addField("`" + Config.DiscordBot.Prefix + "server " + File.split(".")[0] + "`", require("./" + File).description);
    });

    await message.reply(Embed);
};