const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args
 * @returns void 
 */
exports.run = async (client, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} | Tickets Help`, client.user.avatarURL())
        .addField(
            `🎫 | Ticket Commands`,
            `This ticket system has been **deprecated**, please use the \`/open\` command on <@702544362214785145> to create a ticket.`,
        )
        .setThumbnail("https://cdn.discordapp.com/emojis/860696559573663815.png?v=1")
        .setColor(message.guild.me.displayHexColor)
        .setTimestamp();
    await message.reply(embed);
};
