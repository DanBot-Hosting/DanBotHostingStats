const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    name: "upgrade",
    description: "Upgrade a ticket so only admins can respond to it.",
    usage: "upgrade",
    example: "upgrade",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.ticketCommandsEnabled,
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
            ViewChannel: false,
        });

        await message.channel.permissionOverwrites.edit(config.discord.roles.admin, {
            ViewChannel: true,
        });

        message.channel.send(`This ticket has been upgraded to admin only.`);

        const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

        if (ticketLoggingChannel) {
            const embed = new EmbedBuilder()
                .setTitle('Ticket Upgraded')
                .setDescription(`**By**: ${message.author.tag} (${message.author.id})\n**Ticket**: ${message.channel} (${message.channelId})`)
                .setTimestamp()
                .setColor(Colors.Red)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            ticketLoggingChannel.send({ embeds: [embed] });
        }
    },
}