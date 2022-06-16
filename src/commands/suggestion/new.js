const config = require("../../config.json")
const punishmentsSchema = require("../../utils/Schemas/Punishments");
const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const suggestionsSchema = require("../../utils/Schemas/Suggestions");

module.exports = {
    name: "new",
    description: "Make a new suggestion",
    usage: "new <suggestion>",
    example: "new This is a new suggestion",
    requiredPermissions: [],
    checks: [],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const userData = await punishmentsSchema.findOne({ userId: message.author.id })

        if (userData && userData.suggestionBanned) {
            message.channel.send("You have been banned from making a ticket.");
            return;
        }

        const channel = client.channels.cache.get(config.discord.channels.suggestions);

        if (!channel) {
            message.channel.send("The suggestions channel does not exist.");
            return;
        }

        const suggestionCount = await suggestionsSchema.countDocuments();

        const embed = new MessageEmbed()
            .setTitle(`Suggestion #${suggestionCount + 1}`)
            .setDescription(args.join(" "))
            .setColor("DARK_GOLD")
            .setFooter({ text: `Suggested by ${message.author.tag}` })


        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("upvote")
                .setLabel(`0`)
                .setStyle("SUCCESS")
                .setEmoji("⬆️")
            )
            .addComponents(
                new MessageButton()
                .setCustomId("downvote")
                .setLabel(`0`)
                .setStyle("DANGER")
                .setEmoji("⬇️")
            )



        const msg = await channel.send({
            embeds: [embed],
            components: [row]
        });

        await msg.startThread({
            name: args.join(" ").substring(0, 100),
            reason: `New suggestion by ${message.author.username}`,
        })

        await suggestionsSchema.create({
            suggestionId: suggestionCount + 1,
            userId: message.author.id,
            messageId: msg.id,
            upvotes: 0,
            downvotes: 0,
            voted: []
        })

        message.channel.send("Your suggestion has been sent to the suggestions channel.");
    },
}