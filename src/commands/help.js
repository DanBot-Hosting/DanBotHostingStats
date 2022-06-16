const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "Get all commands or a specific command",
    usage: "help <command/sub command> <command>",
    requiredPermissions: [],
    checks: [],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        // Work on This
    },
}