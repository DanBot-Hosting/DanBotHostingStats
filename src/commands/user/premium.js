const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");
const PremiumSchema = require("../../utils/Schemas/Premium");

module.exports = {
    name: "premium",
    description: "Get your Premium Count",
    usage: "premium <user>",
    example: "premium (premium @Wumpus#0000)",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.userCommandsEnabled,
        error: "The user commands are disabled!"
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

        const userData = await PremiumSchema.findOne({ userId: user?.id });

        const embed = new MessageEmbed()
            .setTitle(`${user?.tag || `Wumpus#0000`}'s Premium Count`)
            .setDescription(`${userData?.premiumUsed || 0} out of ${userData?.premiumCount || 0} used`)
            .setColor("BLURPLE")

        message.reply({ embeds: [embed] })
    }
}