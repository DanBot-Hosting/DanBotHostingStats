const config = require("../../config.json");
const UserSchema = require("../../utils/Schemas/User");
const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

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

        const logEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("User unlinked")
            .setDescription(`${message.author} has unlinked an account!`)
            .addFields({ name: "Username", value: User.username.toString() })

        const logChan = message.guild.channels.cache.get(config.discord.channels.userLogs)

        if (logChan) {
            logChan.send({ embeds: [logEmbed] })
        }

        message.reply("You have been unlinked from your panel account.");

        message.member.roles.remove(config.discord.roles.client).catch(console.error);
    },
}