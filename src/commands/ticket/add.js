const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "add",
    description: "Add Someone to your ticket",
    usage: "add <user>",
    example: "add @Wumpus#0000",
    requiredPermissions: [],
    checks: [{
        check: (message) => config.discord.commands.ticketCommandsEnabled,
        error: "Ticket commands are disabled."
    }, {
        check: (message) => message.channel.name.endsWith("-ticket"),
        error: "You can only run this command in tickets."
    }, {
        check: (message, args) => args?.[0] !== undefined,
        error: "Please mention a user or provide a valid user ID."
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user) {
            message.channel.send("Please mention a user or provide a valid user ID.");
            return;
        }

        await message.channel.permissionOverwrites.edit(user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ADD_REACTIONS: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
            EMBED_LINKS: true,
        });

        message.channel.send(`${user} has been added to this ticket.`);
    },
}