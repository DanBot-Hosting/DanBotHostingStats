const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const config = require("../config.json")

module.exports = {
    event: "messageUpdate",
    /**
     * @param {Client} client 
     * @param {Message} oldMessage
     * @param {Message} newMessage 
     */
    run: async (client, oldMessage, newMessage) => {

        if (oldMessage.partial || newMessage.partial) {
            await newMessage.fetch();
            await oldMessage.fetch();
        }

        if (oldMessage?.channel?.parentId == config.discord.categories.userCreation) return;

        if (!oldMessage?.content || !newMessage?.content) return;

        if (oldMessage?.author?.bot) return;

        if (oldMessage.embeds.length !== newMessage.embeds.length) return;

        if (oldMessage.content !== newMessage.content) {
            const logChannel = client.channels.cache.get(config.discord.channels.messageLogs);

            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Message Edited By ${newMessage.author.tag}`,
                    iconURL: newMessage.author.displayAvatarURL()
                })
                .addFields(
                    { name: "Old Message", value: `${oldMessage.content.slice(0, oldMessage.content.length > 1024 ? 1024 : oldMessage.content.length) || "No Content"}` },
                    { name: "New Message", value: `${newMessage.content.slice(0, newMessage.content.length > 1024 ? 1024 : newMessage.content.length) || "No Content"}` }
                )
                .setColor(Colors.Blue)
                .setTimestamp()
                .setFooter({
                    text: `Edited in: ${newMessage.channel.name}`,
                    icon_url: `${newMessage.author.displayAvatarURL({
                        format: "png",
                        dynamic: true,
                    })}`
                })

            logChannel.send({ embeds: [embed] }).catch(console.error);
        }
    }
}