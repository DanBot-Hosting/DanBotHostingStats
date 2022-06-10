const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../config.json");
const chalk = require("chalk");


module.exports = {
    event: "messageCreate",
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        if (message.author.bot) return;

        if (message?.channel?.type == "DM") {
            const chan = client.channels.cache.get(config.discord.channels.dmLogs)
            const embed = new MessageEmbed()
                .setTitle(`Dm From ${message.author.tag}`)
                .setDescription(`${message?.content || "No Content"}`)
                .setColor("BLUE")
                .setTimestamp()

            if (chan) {
                chan.send({ embeds: [embed] }).catch(err => {
                    console.log(`Error sending dm to logs channel: ${err}`)
                })
            }
        }

        if (!message.content.startsWith(config.bot.prefix)) return

        const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/g);

        if (!client.commands.has(args[0])) return;

        if (client.commands.get(args[0])?.[0]) {
            const subcommand = args[1];

            for (const command of client.commands.get(args[0])) {
                if (command.name !== subcommand) continue;

                if (command?.requiredPermissions) {
                    for (const permission of command.requiredPermissions) {
                        if (!message.member.permissions.has(permission)) {
                            message.reply(`Sorry, You don't have the \`${permission}\` permission to use this command.`);
                            return;
                        }
                    }
                }
                if (command?.checks) {
                    for (const check of command.checks) {
                        if (!check.check(message, args.slice(2))) {
                            message.reply(check?.error?.toString() || "You Failed the check.");
                            return;
                        }
                    }
                }

                console.log(chalk.green('[Discord]'), `${message.author.tag} (${message.author.id}) used the command`, chalk.blue(command.name), `from subgroup ${chalk.blue(args[0])}`);
                command.run(client, message, args.slice(2));
            }
        } else {
            const cmdD = client.commands.get(args[0]);
            if (cmdD?.requiredPermissions) {
                for (const permission of cmdD.requiredPermissions) {
                    if (!message.member.permissions.has(permission)) {
                        message.reply(`Sorry, You don't have the \`${permission}\` permission to use this command.`);
                        return;
                    }
                }
            }

            if (cmdD?.checks) {
                for (const check of cmdD.checks) {
                    if (!check.check(message, args.slice(1))) {
                        message.reply(check?.error?.toString() || "You Failed the check.");
                        return;
                    }
                }
            }
            console.log(chalk.green('[Discord]'), `${message.author.tag} (${message.author.id}) used the command`, chalk.blue(cmdD.name));
            cmdD.run(client, message, args.slice(1));
        }
    }
}