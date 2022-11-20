const punishmentsSchema = require("../../utils/Schemas/Punishments");
const { Client, Message } = require("discord.js");
const suggestionsSchema = require("../../utils/Schemas/Suggestions");
const config = require("../../config.json");
module.exports = {
    name: "remove",
    description: "Remove a Suggestion",
    usage: "remove <suggestionId>",
    example: "remove 3",
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

        const suggestion = await suggestionsSchema.findOne({ suggestionId: args[0] });

        if (!suggestion) {
            message.channel.send("This suggestion does not exist.");
            return;
        }

        if (suggestion.userId != message.author.id) {
            message.channel.send("You can only remove your own suggestions.");
            return;
        }

        const msg = await client.channels.cache.get(config.discord.channels.suggestions).messages.fetch(suggestion.messageId);

        if (msg) {
            msg.delete();
        } else {
            message.channel.send("The suggestion message does not exist.");
        }

        await suggestionsSchema.deleteOne({ suggestionId: args[0] });

        message.channel.send("Suggestion removed.");
    },
}