exports.run = async(client, message, args) => {

    const humanizeDuration = require('humanize-duration');

    let myDate = new Date(client.readyTimestamp);
    const embed = new Discord.MessageEmbed()
        .addField(":white_check_mark: Uptime:", `**${humanizeDuration(client.uptime, {round: true})}**`, true)
        .addField(":white_check_mark: Database Uptime:", `**${await dbUptime()}**`, true)
        .addField("Memory usage:", Math.trunc((process.memoryUsage().heapUsed) / 1024 / 1000) + "mb", true)
        .addField("Bot ping to discord:", client.ws.ping + "ms", true)
        .setFooter(`Ready Timestamp: ${myDate.toString()}`)
        .setColor("GREEN")
    message.channel.send(embed);
}
