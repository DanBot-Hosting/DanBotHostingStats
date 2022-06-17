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

                if (command?.cooldown) {
                    let cooldown = await client.cache.get("cooldowns")
    
                    if (cooldown) {
                        cooldown = JSON.parse(cooldown)
    
                        const userCooldowns = cooldown?.find(c => c.userId === message.author.id)
    
                        if (!userCooldowns) {
                            cooldown.push({ userId: message.author.id, cooldowns: [{ toplevelCommand: args[0], subcommand: command.name, time: Date.now() + command.cooldown }] })
                            await client.cache.set("cooldowns", JSON.stringify(cooldown))
                        }
    
                        const cooldownData = userCooldowns?.cooldowns?.find(c => c.toplevelCommand === command.name && c.subcommand === command.name)
    
                        if (cooldownData) {
                            const time = cooldownData.time - Date.now()
    
                            if (time > 0) {
                                message.reply(config.discord.messages.coolDown.replace("{time}", `${time / 1000}`))
                                return
                            } else {
                                userCooldowns.cooldowns.splice(userCooldowns.cooldowns.indexOf(cooldownData), 1)
                                userCooldowns?.cooldowns.push({ toplevelCommand: args[0], subcommand: command.name, time: Date.now() + command.cooldown })
                                await client.cache.set("cooldowns", JSON.stringify(cooldown), config.bot.cooldownCacheTTL)
                            }
                        } else {
                            console.log("Setting cooldown")
                            userCooldowns?.cooldowns.push({ toplevelCommand: args[0], subcommand: command.name, time: Date.now() + command.cooldown })
                            await client.cache.set("cooldowns", JSON.stringify(cooldown), config.bot.cooldownCacheTTL)
                        }
                    } else {
                        await client.cache.set("cooldowns", JSON.stringify([{
                            userId: message.author.id,
                            cooldowns: [{ toplevelCommand: args[0], subcommand: command.name, time: Date.now() + command.cooldown }]
                        }]), config.bot.cooldownCacheTTL)
                    }
                }

                console.log(chalk.green('[Discord]'), `${message.author.tag} (${message.author.id}) used the command`, chalk.blue(command.name), `from subgroup ${chalk.blue(args[0])}`);
                command.run(client, message, args.slice(2));
            }
        } else {
            const command = client.commands.get(args[0]);
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
                    if (!check.check(message, args.slice(1))) {
                        message.reply(check?.error?.toString() || "You Failed the check.");
                        return;
                    }
                }
            }

            if (command?.cooldown) {
                let cooldown = await client.cache.get("cooldowns")

                if (cooldown) {
                    cooldown = JSON.parse(cooldown)

                    const userCooldowns = cooldown?.find(c => c.userId === message.author.id)

                    if (!userCooldowns) {
                        cooldown.push({ userId: message.author.id, cooldowns: [{ toplevelCommand: command.name, subcommand: null, time: Date.now() + command.cooldown }] })
                        await client.cache.set("cooldowns", JSON.stringify(cooldown))
                    }

                    const cooldownData = userCooldowns?.cooldowns?.find(c => c.toplevelCommand === command.name)

                    if (cooldownData) {
                        const time = cooldownData.time - Date.now()

                        if (time > 0) {
                            message.reply(config.discord.messages.coolDown.replace("{time}", `${time / 1000}`))
                            return
                        } else {
                            userCooldowns.cooldowns.splice(userCooldowns.cooldowns.indexOf(cooldownData), 1)
                            userCooldowns?.cooldowns.push({ toplevelCommand: command.name, subcommand: null, time: Date.now() + command.cooldown })
                            await client.cache.set("cooldowns", JSON.stringify(cooldown), config.bot.cooldownCacheTTL)
                        }
                    } else {
                        console.log("Setting cooldown")
                        userCooldowns?.cooldowns.push({ toplevelCommand: command.name, subcommand: null, time: Date.now() + command.cooldown })
                        await client.cache.set("cooldowns", JSON.stringify(cooldown), config.bot.cooldownCacheTTL)
                    }
                } else {
                    await client.cache.set("cooldowns", JSON.stringify([{
                        userId: message.author.id,
                        cooldowns: [{ toplevelCommand: command.name, subcommand: null, time: Date.now() + command.cooldown }]
                    }]), config.bot.cooldownCacheTTL)
                }
            }

            console.log(chalk.green('[Discord]'), `${message.author.tag} (${message.author.id}) used the command`, chalk.blue(command.name));
            command.run(client, message, args.slice(1));
        }
    }
}