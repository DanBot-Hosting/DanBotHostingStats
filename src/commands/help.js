const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "Get all commands or a specific command",
    usage: "help <command/sub command> <command>",
    requiredPermissions: [],
    checks: [],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        if (args[1]) {
            const cmds = client.commands.get(args[1]);

            if (!cmds) {
                message.reply("That command does not exist!");
                return;
            }

            if (!cmds?.[0]) {
                const embed = new MessageEmbed()
                    .setTitle(`Command: ${cmds.name}`)
                    .setDescription(cmds.description)
                    .addField("Usage", cmds.usage)
                    .addField("Required Permissions", cmds.requiredPermissions.join(", "))
                    .setColor("BLUE")
                    .setTimestamp()
                message.channel.send({ embeds: [embed] });
            }
        }
    },
}