const ms = require('ms');
const Discord = require('discord.js');
const db = require('quick.db');
const mutesData = new db.table("muteData");
const chalk = require('chalk');
let mutes = {};

exports.init = (client) => {

    client.on('ready', () => {
        console.log(chalk.magenta('[DISCORD] ') + chalk.red("Syncing mutes"));
        let guild = client.guilds.cache.get(config.DiscordBot.mainGuild)
        let modlog = guild.channels.cache.find(channel => channel.id === config.DiscordBot.modLogs);

        mutesData.fetchAll().map(x => ({
            ID: x.ID,
            data: x.data
        })).forEach(x => {
            let member = guild.members.cache.get(x.ID);
            if (x.data.expiresAt <= Date.now()) {
                mutesData.delete(x.ID);
                if (member != null) {
                    member.roles.remove(config.DiscordBot.roles.mute);
                    if (modlog != null)
                        modlog.send("", {
                            embed: new Discord.MessageEmbed().setTitle("Action: Unmute")
                                .addField("User", member.user.tag + " (ID: " + member.id + ")")
                                .addField("After", ms(x.data.expiresAt - x.data.mutedAt, {
                                    long: true
                                }), true)
                                .setFooter("Time:").setTimestamp()
                        })
                }
            } else {
                mutes[x.ID] = setTimeout(() => {
                    delete mutes[x.id];
                    mutesData.delete(x.ID);
                    if (guild.members.cache.get(x.ID) != null) {
                        member.roles.remove(config.DiscordBot.roles.mute);
                        if (modlog != null)
                            modlog.send("", {
                                embed: new Discord.MessageEmbed().setTitle("Action: Unmute")
                                    .addField("User", member.user.tag + " (ID: " + member.id + ")")

                                    .setFooter("Time:").setTimestamp()
                            })
                    }
                }, x.data.expiresAt - Date.now());
            }
        })
    })

    client.on("guildMemberUpdate", (oldM, newM) => {
        if (oldM.roles.cache.get(config.DiscordBot.roles.mute) != null && newM.roles.cache.get(config.DiscordBot.roles.mute) == null) {
            mutesData.delete(oldM.id);
            clearTimeout(mutes[oldM.id])
            delete mutes[oldM.id];
        }
    })
}


exports.run = async(client, message, args) => {
    let modlog = message.guild.channels.cache.find(channel => channel.id === config.DiscordBot.modLogs);

    if (message.member.roles.cache.find(r => r.id === config.DiscordBot.roles.staff) == null) return message.reply("sorry, but it looks like you're too much of an egg to run this command. 🥚");
    if (message.member.roles.cache.find(r => r.id === "248470317540966443")) return message.reply("sorry, but it looks like you're too much of an egg to run this command. 🥚");
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_ROLES. :x:');


    if (args.length < 1) {
        message.channel.send('', {
            embed: new Discord.MessageEmbed().setColor(0x00A2E8)
                .setDescription(`Correct usage ${config.DiscordBot.Prefix}mute <@user|userID> [Time : 5m] [Reason : unspecified]`).setFooter('<required> [optional]')
        })
        return;
    }
    let target = message.guild.members.cache.get(args[0].match(/[0-9]{18}/).length == 0 ? args[0] : args[0].match(/[0-9]{18}/)[0])
    let reason = args.slice(2).join(' ') || `unspecified`;
    let time = ms(args[1]) || 300000;

    if (target == null) return message.reply("please specify a valid user.");
    if (time > 2592000000) time = 315569520000; //10Years
    if (time < 5000) time = 5000; //5seconds


    await target.roles.add(config.DiscordBot.roles.mute)

    mutesData.set(target.id, {
        mutedAt: Date.now(),
        expiresAt: Date.now() + time
    });

    message.channel.send(":white_check_mark: ***The user has been successfully muted for " + ms(time, {
        long: true
    }) + "!***");

    if (mutes[target.id] != null) clearTimeout(mutes[target.id])
    mutes[target.id] = setTimeout(() => {
        delete mutes[target.id];
        mutesData.delete(target.id);
        if (message.guild.members.cache.find(x => x.id == args[0].match(/[0-9]{18}/)[0]) != null) {
            target.roles.remove(config.DiscordBot.roles.mute);
            if (modlog != null)
                modlog.send("", {
                    embed: new Discord.MessageEmbed().setTitle("Action: Unmute")
                        .addField("User", target.user.tag + " (ID: " + target.id + ")")
                        .addField("After", ms(time, {
                            long: true
                        }), true)
                        .setFooter("Time:").setTimestamp()
                })
        }
    }, time);


    if (modlog != null) {
        modlog.send('', {
            embed: new Discord.MessageEmbed()
                .setColor(0x00A2E8)
                .setTitle("Action: Mute")
                .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                .addField("User", target.user.tag + " (ID: " + target.id + ")")
                .addField("Time", ms(time, {
                    long: true
                }), true)
                .addField("Reason", reason, true)
                .setFooter("Time used:").setTimestamp()
        })
    }
};
