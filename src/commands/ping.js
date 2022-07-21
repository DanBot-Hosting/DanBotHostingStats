const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Get the bot's ping",
    usage: "ping",
    example: "ping",
    requiredPermissions: [],
    checks: [],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setTitle(`${client.user.username}'s Ping`)
            .setDescription(`API Latency: ${client.ws.ping}ms`)
            .setColor(Colors.Blue)
            .setTimestamp()
        message.reply({ embeds: [embed] });
    },
}