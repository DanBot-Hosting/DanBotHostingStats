const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");

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
        await message.channel.permissionOverwrites.edit(config.discord.roles.staff, {
            VIEW_CHANNEL: true,
        });

        message.channel.send(`This ticket has been downgraded to normal staff.`);

        const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

        if (ticketLoggingChannel) {
            const embed = new MessageEmbed()
            .setTitle('Ticket Downgraded')
            .setDescription(`**By**: ${user.tag} (${user.id})\n**Ticket**: ${message.channel} (${message.channelId})`)
            .setTimestamp()
            .setColor('RED')
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            ticketLoggingChannel.send({ embeds: [embed] });
        }
    },
}