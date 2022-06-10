const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "new",
    description: "Create a new ticket.",
    usage: "new",
    example: "new",
    requiredPermissions: [],
    checks: [{
        check: (message) => config.discord.commands.ticketCommandsEnabled,
        error: "Ticket commands are disabled."
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {

        const category = message.guild.channels.cache.get(config.discord.categories.tickets);

        if (!category) {
            message.channel.send("There is no ticket category. Please contact a Admin!");
            return;
        }

        const ticket = await category.createChannel(`🎫-${message.author.username}-${message.author.discriminator}-ticket`, {
            type: "text",
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"],
                }, {
                    id: message.author.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"],
                }, {
                    id: config.discord.roles.staff,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"],
                },
            ],
        }).catch(console.error);

        ticket.setTopic(`${message.author.id}`);

        const embed = new MessageEmbed()
            .setTitle(`${client.user.username} | Ticket`)
            .setDescription(`> Please do not ping staff members, This won't help you in the long run\n\nPlease Ask your question below in as much detail as you can!`)
            .setFooter({
                text: `${message.author.tag} | ${message.author.id}`,
            })
            .setTimestamp()
            .setColor("DARK_BLUE")

        await ticket.send({ content: `${message.author.toString()} <@&${config.discord.roles.newTicket}>`, embeds: [embed] });

        message.channel.send(`Your ticket has been created! Please check ${ticket} to view your ticket!`);

        return;
    },
}
