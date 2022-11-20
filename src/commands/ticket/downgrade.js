const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    name: "downgrade",
    description: "Downgrades a ticket so normal staff can respond to it.",
    usage: "downgrade",
    example: "downgrade",
    requiredPermissions: [],
    checks: [{
        check: (message) => config.discord.commands.ticketCommandsEnabled,
        error: "Ticket commands are disabled."
    }, {
        check: (message) => message.channel.name.endsWith("-ticket"),
        error: "You can only run this command in tickets."
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

        await message.channel.permissionOverwrites.edit(config.discord.roles.staff, {
            ViewChannel: true,
        });

        message.channel.send(`This ticket has been downgraded to normal staff.`);

        const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

        if (ticketLoggingChannel) {
            const embed = new EmbedBuilder()
                .setTitle('Ticket Downgraded')
                .setDescription(`**By**: ${message.author.tag} (${message.author.id})\n**Ticket**: ${message.channel} (${message.channelId})`)
                .setTimestamp()
                .setColor(Colors.Red)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            ticketLoggingChannel.send({ embeds: [embed] });
        }
    },
}