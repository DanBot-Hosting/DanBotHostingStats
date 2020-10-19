const {
    config
} = require('process');

const exec = require('child_process').exec;
exports.run = async (client, message, args) => {
    if (!message.member.roles.find(r => r.id == "748117822370086932")) return;

    if (args[0] == null) {
        if (message.member.roles.find(r => r.id == "639489438036000769")) {
            let embed = new Discord.RichEmbed()
                .setColor('RANDOM')
                .addField('**Staff Commands:**', config.DiscordBot.Prefix + "staff linked useridhere | Shows if the users account is linked.")
                .addField('**Admin Commands:**', config.DiscordBot.Prefix + "staff apply open/closed | Open or close staff applications. \n" + config.DiscordBot.Prefix + "staff settings | Shows current website settings")
                .addField('**Owner Commands:**', config.DiscordBot.Prefix + "staff maintenance on/off | Enable or disable website maintenance. \n" + config.DiscordBot.Prefix + "staff update | Pulls updates from GitHub")
            message.channel.send(embed)
        } else {
            let embed = new Discord.RichEmbed()
                .setColor('RANDOM')
                .addField('**Staff Commands:**', config.DiscordBot.Prefix + "staff linked useridhere | Shows if the users account is linked.")
            message.channel.send(embed)
        }
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
                    let embed = new Discord.RichEmbed()
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
                if (args[1] == "open") {
                    webSettings.set("staff-applications", {
                        enabled: "true"
                    });
                    message.channel.send("Staff applications now open")
                } else if (args[1] == "close") {
                    webSettings.set("staff-applications", {
                        enabled: "false"
                    });
                    message.channel.send("Staff applications now closed")
                } else {
                    if (webSettings.fetch("staff-applications.enabled") == "true") {
                        message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/closed` to enable or disable staff applications \n**Staff applications are currently:** **OPEN**");
                    } else if (webSettings.fetch("staff-applications.enabled") == "false") {
                        message.channel.send("Please run the command using the following format: `" + config.DiscordBot.Prefix + "staff apply open/closed` to enable or disable staff applications \n**Staff applications are currently:** **CLOSED**");
                    }
                };
            };
            break;

        case 'settings':
            if (message.member.roles.find(r => r.id === "639489438036000769")) {
                let embed = new Discord.RichEmbed()
                    .addField('__**Staff Applications Enabled?**__', webSettings.fetch("staff-applications.enabled"), true)
                    .addField('__**Website maintenance enabled?**__', webSettings.fetch("maintenance.enabled"), true)
                message.channel.send(embed)
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
                let embed = new Discord.RichEmbed()
                    .addField('__**Request Types (Type | Type Meaning):**__', "`proxy` | Reverse Proxy \n`password` | Password reset \n`server` | Server creation (If not on createserver) \n`delete` | Server Deletion")
                message.channel.send(embed)
            } else if (args[1] === "delete") {
                //Delete request
            }
            break;
        case 'reactionroles':
            let reactionRoles = require('../reactionRoles');
            client.reactionRoles = reactionRoleConfig;

            let reactionRolesChannels = Object.keys(reactionRoles);

            reactionRolesChannels.forEach(c => {
                let channel = client.channels.get(c);
                let reactionRolesChannelMessages = Object.keys(reactionRoles[c]);
                reactionRolesChannelMessages.forEach(async m => {
                    let message = await channel.fetchMessage(m);
                    let reactions = Object.keys(reactionRoles[c][r]);
                    await message.clearReactions();

                    for (let ri in reactions) {
                        let reaction = reactions[ri];
                        if (reaction.length == 18) client.emojis.get(reaction);
                        await message.react(reaction);
                    }
                });
            })
            break;
        case 'update':
            if (message.member.roles.find(r => r.id === "639481606112804875") || message.author.id == '293841631583535106') {
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
    }

}