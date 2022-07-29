const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors, ChannelType } = require("discord.js");

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

        const userData = await punishmentsSchema.findOne({ userId: message.author.id })

        if (userData && userData.ticketBanned) {
            message.channel.send("You have been banned from making a ticket.");
            return;
        }

        const category = message.guild.channels.cache.get(config.discord.categories.tickets);

        if (!category) {
            message.channel.send("There is no ticket category. Please contact a Admin!");
            return;
        }

        const ticket = await message.guild.channels.create({
            name: `🎫-${message.author.username}-${message.author.discriminator}-ticket`,
            parent: category,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ["ViewChannel"],
                }, {
                    id: message.author.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                }, {
                    id: config.discord.roles.staff,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                },
            ],
        }).catch(console.error);

        ticket.setTopic(`${message.author.id}`);

        const embed = new EmbedBuilder()
            .setTitle(`${client.user.username} | Ticket`)
            .setDescription(`> Please do not ping staff members, This won't help you in the long run\n\nPlease Ask your question below in as much detail as you can!`)
            .setFooter({
                text: `${message.author.tag} | ${message.author.id}`,
            })
            .setTimestamp()
            .setColor(Colors.DarkBlue)

        await ticket.send({ content: `${message.author.toString()} <@&${config.discord.roles.newTicket}>`, embeds: [embed] });

        message.channel.send(`Your ticket has been created! Please check ${ticket} to view your ticket!`);

        const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

        if (ticketLoggingChannel) {
            const embed = new EmbedBuilder()
                .setTitle(`Ticket Created`)
                .setDescription(`**Created By**: ${message.author.tag} (${message.author.id})\n**Ticket**: ${ticket} (${message.channel.id})`)
                .setTimestamp()
                .setColor(Colors.Green)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            return ticketLoggingChannel.send({ embeds: [embed] });
        }

        return;
    },
}