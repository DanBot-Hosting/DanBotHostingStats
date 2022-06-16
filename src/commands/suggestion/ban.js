const punishmentsSchema = require("../../utils/Schemas/Punishments");
const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban/Unban someone from making a suggestion",
    usage: "ban <@user>",
    example: "ban @Wumpus#0000",
    requiredPermissions: [],
    checks: [{
        check: (message) => message.member.roles.cache.has(config.discord.roles.helper),
        error: "You do not have permission to use this command."
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
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!user) {
            message.channel.send("Please mention a user or provide a valid user ID.");
            return;
        }

        const userData = await punishmentsSchema.findOne({ userId: user.id });

        if (!userData) {
            await punishmentsSchema.create({
                userId: user.id,
                suggestionBanned: true
            });
        } else {
            await punishmentsSchema.updateOne({ userId: user.id }, {
                $set: {
                    suggestionBanned: !userData.suggestionBanned
                }
            });
        }

        message.channel.send(`${user} has been ${userData?.suggestionBanned ? "unbanned" : "banned"} from making a suggestion.`);
    },
}