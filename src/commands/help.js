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
        const command = args[0];
        const subcommand = args?.[1];

        if (!subcommand) {
            const cmd = client.commands.get(command);

            if (!cmd) {
                message.reply("That command/subbcommand group doesn't exist.");
                return;
            }

            if (!cmd?.length) {
                const embed = new MessageEmbed()
                    .setTitle(`Info on ${cmd.name}`)
                    .addField("Description", cmd.description?.toString() ?? "No Description")
                    .addField("Usage", cmd.usage?.toString() ?? "No Usage")
                    .addField("Example", cmd.example?.toString() ?? "No Example")
                    .setColor("BLUE")
                    .setTimestamp()

                message.reply({ embeds: [embed] });
                return;
            }

            const embed = new MessageEmbed()
                .setTitle(`Commands on SubGroup ${command}`)
                .setColor("BLUE")
                .setTimestamp()

            for (const comd of cmd) {
                embed.description = `${embed?.description ?? ""}\n**${comd.name}** - ${comd.description?.toString() ?? "No Description"}`;
            }


            message.reply({ embeds: [embed] });
        }

        if (subcommand) {
            for (const cmd of client.commands.get(command)) {
                if (cmd.name !== subcommand) continue;

                const embed = new MessageEmbed()
                    .setTitle(`Info on ${cmd.name}`)
                    .addField("Description", cmd.description?.toString() ?? "No Description")
                    .addField("Usage", cmd.usage?.toString() ?? "No Usage")
                    .addField("Example", cmd.example?.toString() ?? "No Example")
                    .setColor("BLUE")
                    .setTimestamp()

                message.reply({ embeds: [embed] });
                return;
            }

            message.reply("That subcommand doesn't exist.");
        }
    },
}