let subcommands = {
    admin: {
        linked: ["Shows if the users account is linked.", 'linked <USERID>'],
        apply: ["Manage Staff applications.", '<open/close>'],
        settings: ["Shows current website settings.", ''],
        reactionroles: ["Reloads all reactionRoles.", '']
    },
    devs: {
        maintenance: ["Enable or disable website maintenance.", '<on/off>'],
        update: ["Pulls updates from GitHub.", ''],
        wings: ["Manage the wings of a specific node.", '<NodeID> <Start | Restart | Stop>']
    }
}

let desc = (object) => {
    let description = [];
    let entries = Object.entries(object);
    for (const [subCommand, [desc, usage]] of entries) {
        description.push(`**${subCommand}** - ${desc} (\`${config.DiscordBot.Prefix + "staff " + subCommand + " " + usage}\`)`)
    }
    return description;
}

const exec = require('child_process').exec;

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "639489438036000769")) return;

    if (args[0] == null) {
        let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .addField('**Admin Commands:**', desc(subcommands.admin).join('\n'))
            .addField('**Owner Commands:**', desc(subcommands.devs).join('\n'))
        message.channel.send(embed)

        return;
    }

    switch (args[0].toLowerCase()) {
        case 'linked':
            if (args[1] == null) {
                message.channel.send('Please send a users discord ID to see if they are linked with an account on the host.')
            } else {
                if (userData.get(args[1]) == null) {
                    message.channel.send("That account is not linked with a console account :sad:")
                } else {
                    console.log(userData.fetch(args[1]))
                    let embed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Username**__`, userData.fetch(args[1] + ".username"))
                        .addField(`__**Email**__`, userData.fetch(args[1] + ".email"))
                        .addField(`__**Discord ID**__`, userData.fetch(args[1] + ".discordID"))
                        .addField(`__**Console ID**__`, userData.fetch(args[1] + ".consoleID"))
                        .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(args[1] + ".linkDate"))
                        .addField(`__**Time**__`, userData.fetch(args[1] + ".linkTime"))
                    message.channel.send('That account is linked. Heres some data: ', embed)
                }
            }
            break;

        case 'apply':
            if (args[1] == null) {
                message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/close` to enable or disable staff applications")
            } else {
                if (args[1] === "open") {
                    webSettings.set("staff-applications", {
                        enabled: "true"
                    });
                    message.channel.send("Staff applications now open")
                } else if (args[1] === "close") {
                    webSettings.set("staff-applications", {
                        enabled: "false"
                    });
                    message.channel.send("Staff applications now closed")
                } else {
                    if (webSettings.fetch("staff-applications.enabled") === "true") {
                        message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/close` to enable or disable staff applications \n**Staff applications are currently:** **OPEN**");
                    } else if (webSettings.fetch("staff-applications.enabled") === "false") {
                        message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/close` to enable or disable staff applications \n**Staff applications are currently:** **CLOSED**");
                    }
                };
            };
            break;
        case 'request':
            if (args[1] === "new") {
                if (args[2] === "proxy") {
                    //Type: Proxy
                }
                //New request
                message.channel.send('Please use the following format: `' + config.DiscordBot.Prefix + "staff request type userid serverid` \nYou can view types by running: `" + config.DiscordBot.Prefix + "staff request types`")
            } else if (args[1] === "types") {
                //Types
                let embed = new Discord.MessageEmbed()
                    .addField('__**Request Types (Type | Type Meaning):**__', "`proxy` | Reverse Proxy \n`password` | Password reset \n`server` | Server creation (If not on createserver) \n`delete` | Server Deletion")
                message.channel.send(embed)
            } else if (args[1] === "delete") {
                //Delete request
            }
            break;

        case 'settings':
            if (message.member.roles.cache.find(r => r.id === "778237595477606440")) {
                let embed = new Discord.MessageEmbed()
                    .addField('__**Staff Applications Enabled?**__', webSettings.fetch("staff-applications.enabled"), true)
                    .addField('__**Website maintenance enabled?**__', webSettings.fetch("maintenance.enabled"), true)
                message.channel.send(embed)
            };
            break;

        case 'reactionroles':
            if (!message.member.roles.cache.find(r => r.id === "778237595477606440")) return;
            message.channel.send("Reloading reaction roles...")
            let reactionRoles = config.DiscordBot.reactionRoles

            let reactionRolesChannels = Object.keys(reactionRoles);
            reactionRolesChannels.forEach(c => {
                let rchannel = client.channels.cache.get(c);
                let reactionRolesChannelMessages = Object.keys(reactionRoles[c]);

                reactionRolesChannelMessages.forEach(async m => {
                    let rmessage = await rchannel.messages.fetch(m);
                    let reactions = Object.keys(reactionRoles[c][m]);
                    await rmessage.reactions.removeAll();

                    for (let ri in reactions) {
                        let reaction = reactions[ri];
                        if (reaction.length === 18) reaction = client.emojis.cache.get(reaction);
                        await rmessage.react(reaction);
                    }
                    message.channel.send("Done reloading reaction roles...");

                });
            })
            break;
        case 'update':
            if (message.member.roles.cache.find(r => r.id === "778237595477606440")) {
                exec(`git pull`, (error, stdout) => {
                    let response = (error || stdout);
                    if (!error) {
                        if (response.includes("Already up to date.")) {
                            message.channel.send('Bot already up to date. No changes since last pull')
                        } else {
                            message.channel.send('Pulled from GitHub. Restarting bot. \n\nLogs: \n```' + response + "```")
                            setTimeout(() => {
                                process.exit();
                            }, 1000)
                        };
                    }
                });
            } else {
                message.channel.send('OwO')
            }
            break;

        case 'premium':
            if (!['137624084572798976', '293841631583535106'].includes(message.author.id)) return;
            if (args.lenght < 4) return;

            if (args[1].toLowerCase() === 'donated') {
                let amount = Number.parseInt(args[3])
                if (isNaN(amount)) return;
                let userid = args[2]

                userPrem.set(userid + '.donated', amount)
            }

            if (args[1].toLowerCase() === 'boosted') {
                let amount = Number.parseInt(args[3])
                if (isNaN(amount)) return;
                let userid = args[2]

                userPrem.set(userid + '.boosted', amount)
            }

            message.reply('done')
            break;

        case 'wings':
            if (!['137624084572798976', '293841631583535106'].includes(message.author.id)) return;
            require('axios')({
                url: "http://n" + args[1] + ".danbot.host:999/wings?action=" + args[2].toLowerCase(),
                method: 'GET',
                headers: {
                    "password": config.externalPassword
                },
            }).then(response => {
                message.channel.send(response.data.status)
            })
            break;

        case 'lockdown':
            if (!['137624084572798976', '293841631583535106'].includes(message.author.id)) return;
            if (!args[1]) {
                message.channel.send('Channel is now locked. Only admins+ can post here \nUse `DBH!staff lockdown unlock` to unlock this channel')
                message.channel.updateOverwrite("639477525927690240", {
                    SEND_MESSAGES: false
                })
            } else if (args[1].toLowerCase() === "unlock") {
                message.channel.send('Channel is now unlocked. Everyone can now send messages here again!')
                message.channel.updateOverwrite("639477525927690240", {
                    SEND_MESSAGES: true
                })
            }
            break;
    }

}