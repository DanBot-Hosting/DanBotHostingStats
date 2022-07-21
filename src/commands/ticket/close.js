const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    name: "close",
    description: "Close a ticket.",
    usage: "close",
    example: "close",
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

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("close")
            .setEmoji("✅")
            .setLabel("Close")
            .setStyle(ButtonStyle.Success)
        ).addComponents(
            new ButtonBuilder()
            .setCustomId("cancel")
            .setEmoji("✖️")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        )

        const embed = new EmbedBuilder()
            .setTitle("Close Ticket")
            .setDescription("Are you sure you want to close this ticket?")
            .setFooter({
                text: `${message.author.tag} | ${message.author.id}`,
            })
            .setTimestamp()

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

        collector.on('collect', async i => {

            const user = i.user;

            if (i.user.id !== message.author.id) return i.reply('Only the user who invoked this command can close the ticket.');

            if (i.customId === "close") {
                i.reply({
                    content: "Closing Ticket...",
                });

                setTimeout(() => {
                    message.channel.delete();
                }, 5000);

                const ticketLoggingChannel = message.guild.channels.cache.get(config.discord.channels.ticketLogs);

                if (ticketLoggingChannel) {
                    const messages = await message.channel.messages.fetch({ limit: 100, after: 0 })
                    const transformedMessages = [...messages.mapValues((m) => `${m.author.tag}: ${m.cleanContent}`).reverse()]

                    const embed = new EmbedBuilder()
                        .setTitle('Ticket closed')
                        .setDescription(`**By**: ${user.tag} (${user.id})\n**Ticket**: ${message.channel} (${message.channelId})`)
                        .setTimestamp()
                        .setColor(Colors.Red)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                    ticketLoggingChannel.send({ embeds: [embed] })
                }
            } else {
                i.reply({
                    content: "Cancled Closing Ticket...",
                });
                return;
            }
        }).on('end', (collected, reason) => {
            if (!collected.size && reason === 'time') msg.edit({ content: 'You ran out of time.', components: [] })
        })
    }
}