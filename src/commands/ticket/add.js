const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

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

        const userData = await punishmentsSchema.findOne({ userId: message.author.id })

        if (userData && userData.ticketBanned) {
            message.channel.send("You have been banned from making a ticket.");
            return;
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!user) {
            message.channel.send("Please mention a user or provide a valid user ID.");
            return;
        }

        await message.channel.permissionOverwrites.edit(user, {
            ViewChannel: true,
            SendMessages: true,
            AddReactions: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true,
        });

        message.channel.send(`${user} has been added to this ticket.`);

        const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

        if (ticketLoggingChannel) {
            const embed = new EmbedBuilder()
                .setTitle('User Added to Ticket')
                .setDescription(`**User**: ${user.tag} (${user.id})\n**Ticket**: ${message.channel} (${message.channelId})\n**Added By**: ${message.author.tag} (${message.author.id})`)
                .setTimestamp()
                .setColor(Colors.Green)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            ticketLoggingChannel.send({ embeds: [embed] });
        }
    },
}