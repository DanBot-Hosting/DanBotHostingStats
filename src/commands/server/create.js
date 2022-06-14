const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");

module.exports = {
    name: "create",
    description: "Create a new server.",
    usage: "create <type> [name]",
    example: "create NodeJS Example",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.serverCommandsEnabled,
        error: "The server commands are disabled!"
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: (client, message, args) => {
        const type = args[0];
        if (!args) return message.reply('Please specify a server type.')

        // TODO: test this
    }
}