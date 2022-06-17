const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "name-of-command",
    description: "Example Command",
    usage: "example", // The usage of the command (HB!example <user> <message>)
    example: "example", // The example of the command (HB!example @Wumpus#0000 test)
    requiredPermissions: [], // The required permissions to use the command (MANAGE_MESSAGES) ETC
    checks: [{ // Checks are a few things you can do/check for before the command runs, This is an example of a check where the user is not allowed to run the command in a channel called example
        check: (message, args) => message.channel.name !== "example", // check should return true and or false. The arguments it has is the message and the args.
        error: "You can't run this in a channel called example" // Error is the message it should respond with if the user failed the check.
    }],
    cooldown: 30000,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        message.reply("You passed the checks :)")
    },
}