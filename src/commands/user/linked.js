const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");

module.exports = {
    name: "linked",
    description: "Get your linked data info",
    usage: "linked",
    example: "linked",
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

        const data = await UserSchema.findOne({ userId: message.author.id });

        if (!data) {
            message.reply("You are not linked to a panel account.");
            return;
        }

        const embed = new MessageEmbed()
            .setTitle(`${message.author.tag}'s Linked Data`)
            .addFields([{
                name: "Console ID",
                value: `${data.consoleId}`,
            }, {
                name: "Username",
                value: `${data.username}`,
            }, {
                name: "Link Date",
                value: `<t:${Math.round(new Date(data.linkDate) / 1000)}:F>`,
            }])

        message.reply({ embeds: [embed] });
    },
}