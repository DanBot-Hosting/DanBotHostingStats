const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const config = require("../config.json")

module.exports = {
    event: "messageDelete",
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        const logChannel = client.channels.cache.get(config.discord.channels.messageLogs);

        if (message.channel.parentId == config.discord.categories.userCreation) return;

        if (!logChannel) return;

        if (message.partial) {
            return;
        }

        if (message.author.id == client.user.id) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Message Deleted By ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription(`${message.content || "No Content"}`)
            .setImage(message.attachments.first()?.url || "")
            .setColor(Colors.Red)
            .setTimestamp()
            .setFooter({
                text: `Deleted in: ${message.channel.name}`,
                icon_url: `${message.author.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                })}`
            })

        logChannel.send({ embeds: [embed] }).catch(console.error);
    }
}