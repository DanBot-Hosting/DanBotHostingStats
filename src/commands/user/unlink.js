const UserSchema = require("../../utils/Schemas/User");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "unlink",
    description: "unlink from db",
    usage: "unlink",
    example: "unlink",
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

        const User = await UserSchema.findOneAndDelete({ userId: message.author.id });

        if (!User) {
            message.reply("You are not linked to a panel account.");
            return;
        }

        message.reply("You have been unlinked from your panel account.");
    },
}