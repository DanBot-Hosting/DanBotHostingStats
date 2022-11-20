const { Client, Message, EmbedBuilder, Colors } = require("discord.js");

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

        if (!command) {

            const embed = new EmbedBuilder()
                .setTitle("All Commands")
                .setColor(Colors.Blurple)

            for (const key of client.commands.keys()) {
                const cmd = client.commands.get(key);
                let ad = ""
                if (!cmd.name) {
                    for (const subcmd of cmd) {
                        ad += `\`${subcmd.name}\`, `
                    }

                    embed.addFields({ name: key.toString(), value: ad.slice(0, -2) })
                } else {
                    const normalCmds = embed.data.fields.find(f => f.name === `Normal Commands`)

                    if (normalCmds) {
                        embed.data.fields.splice(embed.data.fields.indexOf(normalCmds), 1)
                    } else {
                        embed.addFields({ name: `Normal Commands`, value: `\`${cmd.name}\`` })
                        continue;
                    }

                    embed.addFields({ name: "Normal Commands", value: normalCmds.value + `, \`${cmd.name}\`` })
                }
            }

            message.reply({
                embeds: [embed]
            })
        }

        if (!subcommand && command) {
            const cmd = client.commands.get(command);

            if (!cmd) {
                message.reply("That command/Subcommand group doesn't exist.");
                return;
            }

            if (!cmd?.length) {
                const embed = new EmbedBuilder()
                    .setTitle(`Info on ${cmd.name}`)
                    .addFields(
                        {
                            name: "Description",
                            value: cmd.description?.toString() ?? "No Description"
                        },
                        {
                            name: "Usage",
                            value: cmd.usage?.toString() ?? "No Usage"
                        },
                        {
                            name: "Example",
                            value: cmd.example?.toString() ?? "No Example"
                        }
                    )
                    .setColor(Colors.Blue)
                    .setTimestamp()

                message.reply({ embeds: [info] });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`Commands on SubGroup ${command}`)
                .setColor(Colors.Blue)
                .setTimestamp()

            for (const comd of cmd) {
                embed.addFields({
                    name: comd.name,
                    value: comd.description?.toString() ?? "No Description"
                })
            }


            message.reply({ embeds: [embed] });
        }

        if (subcommand) {
            for (const cmd of client.commands.get(command)) {
                if (cmd.name !== subcommand) continue;

                const embed = new EmbedBuilder()
                    .setTitle(`Info on ${cmd.name}`)
                    .addFields(
                        {
                            name: "Description",
                            value: cmd.description?.toString() ?? "No Description"
                        },
                        {
                            name: "Usage",
                            value: cmd.usage?.toString() ?? "No Usage"
                        },
                        {
                            name: "Example",
                            value: cmd.example?.toString() ?? "No Example"
                        }
                    )
                    .setColor(Colors.Blue)
                    .setTimestamp()

                message.reply({ embeds: [embed] });
                return;
            }

            message.reply("That subcommand doesn't exist.");
        }
    },
}