const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const User = require("../utils/Schemas/User");

module.exports = {
    name: "stats",
    description: "Get the stats about the bot",
    usage: "stats",
    example: "stats",
    requiredPermissions: [],
    checks: [],
    cooldown: 1000,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {

        const msgThen = Date.now();

        const msg = await message.channel.send("Fetching stats...");

        const msgPing = Math.round(Date.now() - msgThen);

        const dbThen = Date.now();

        await User.findOne({ userID: message.author.id });

        const dbPing = Math.round(Date.now() - dbThen);

        const cacheThen = Date.now();

        await client.cache.get("users");

        const cachePing = Math.round(Date.now() - cacheThen);

        const embed = new EmbedBuilder()
            .setTitle(`${client.user.username} | Stats`)
            .addFields(
                { name: "Ram Usage", value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true },
                { name: "Bot Uptime", value: `${Math.round(client.uptime / 1000)}s`, inline: true },
                { name: "WS Ping", value: `${Math.round(client.ws.ping)}ms`, inline: true },
                { name: "Cache Ping", value: `${cachePing}ms`, inline: true },
                { name: "Database Ping", value: `${dbPing}ms`, inline: true },
                { name: "Message Ping", value: `${msgPing}ms`, inline: true }

            )
            .setTimestamp()
            .setColor(Colors.Blue)

        msg.edit({ content: " ", embeds: [embed] });
    },
}