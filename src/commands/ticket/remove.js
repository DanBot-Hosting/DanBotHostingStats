const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove",
    description: "Remove someone from a ticket",
    usage: "remove <user>",
    example: "remove @Wumpus#0000",
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

        if (message.channel.topic.includes(user.user.id)) {
            message.channel.send("You can't remove the creator of the ticket.");
            return;
        }

        await message.channel.permissionOverwrites.edit(user, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            READ_MESSAGE_HISTORY: false,
            ATTACH_FILES: false,
            EMBED_LINKS: false,
        });

        message.channel.send(`${user} has been remove from the ticket.`);

        const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

        if (ticketLoggingChannel) {
            const embed = new MessageEmbed()
                .setTitle('User Removed from Ticket')
                .setDescription(`**User**: ${user.tag} (${user.id})\n**Ticket**: ${message.channel} (${message.channelId})\n**Removed By**: ${message.author.tag} (${message.author.id})`)
                .setTimestamp()
                .setColor('RED')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            ticketLoggingChannel.send({ embeds: [embed] });
        }
    },
}