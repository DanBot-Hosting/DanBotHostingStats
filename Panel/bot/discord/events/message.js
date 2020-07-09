//let client = require("../../../../index.js").client;
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = (client, message) => {
    //if(message.content.toLowerCase().includes("tiktok")) {message.reply('Ew. Get out here with that crap :bammer:'), message.delete() }
    if (message.content.toLowerCase().includes("discord.gg")) {
        if (message.channel.id === '717146816918847489') {
            return;
        } else if (message.channel.id === '719259195471429722') {
            return;
        } else {
            message.delete();
            //message.reply('No advertising here. Check out <#717146816918847489> or <#719259195471429722> for advertising!')
        }
    }

    if (message.channel.type == "dm") {
        if (message.author.id == "137624084572798976") {
            const args = message.content.trim().split(/ +/g);
            client.channels.get(args[0]).send(message.content.split(' ').slice(1).join(' '))
        }
    };

    if (message.guild === null && !message.author.bot) {
        let active = await db.fetch(`support_${message.author.id}`);
        let guild = client.guilds.get('639477525927690240');
        let channel = null;
        let found = true;
        try {
            if (active) client.channels.get(active.channelID).guild;
        } catch (e) {
            found = false;
        }
        if (!active || !found) {
            active = {};
            channel = await guild.createChannel(message.author.username + "-ModMail", "text", [{
                type: 'role',
                id: guild.id,
                deny: 0x400
            },
            {
                type: 'user',
                id: message.author.id,
                deny: 1024
            },
            {
                type: "role",
                id: "697599153538334841",
                allow: 84992
            }
            ]).catch(console.error);

            let category = guild.channels.find(c => c.id == "654313162086285323" && c.type == "category");
            if (!category) throw new Error("Category channel does not exist");

            await channel.setParent(category.id);

            channel.overwritePermissions(message.author, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            })

            if (userData.get(message.author.id) == null) {
            channel.send('@ everyone \n\n' + message.author.tag + ' opened this modmail!\n\n *This account is not linked with a console account*');
            } else  {
                let embed = new Discord.RichEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
                    .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(message.author.id + ".linkDate"))
                    .addField(`__**Time**__`, userData.fetch(message.author.id + ".linkTime"))
                    channel.send('@ everyone \n\n <@' + message.author.id + '> here is your ticket! Please give as much info as possible about your problem. \n\n *This account is linked with:* ', embed)
            }

            let author = message.author;

            const newTicket = new Discord.RichEmbed()
                .setColor("00ffff")
                .setAuthor(`Hello, ${author.tag}`, author.displayAvatarURL)
                .setFooter("ModMail ticket created");
            await author.send(newTicket).catch(console.error);

            active.channelID = channel.id;
            active.targetID = author.id;
        }

        channel = client.channels.get(active.channelID);
        const avatar = message.author.avatarURL;
        channel.fetchWebhooks().then((webhooks) => {
                const foundHook = webhooks.find((webhook) => webhook.name == 'modmail');
                console.log(foundHook);
                if (!foundHook) {
                    channel.createWebhook('modmail')
                        .then((webhook) => {
                            webhook.send(message.content, {
                                username: message.author.username,
                                avatarURL: avatar,
                            });
                        });
                } else {
                    foundHook.send(message.content, {
                        username: message.author.username,
                        avatarURL: avatar,
                    });
                };
            });
        message.react('✅');
        db.set(`support_${message.author.id}`, active);
        db.set(`supportChannel_${channel.id}`, message.author.id);
        return;
    }

    const prefix = config.DiscordBot.Prefix;

    let support = await db.fetch(`supportChannel_${message.channel.id}`);
    if (support && !message.content.startsWith(prefix) && !message.author.bot) {
        support = await db.fetch(`support_${support}`);
        let supportUser = client.users.get(support.targetID);
        if (!supportUser) return message.channel.delete();

        client.users.get(support.targetID).send(message.content);

        return message.react('✅');
    }


    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(' ').slice(1).join(' ');
    const command = args.shift().toLowerCase();
    console.log(chalk.magenta("[DISCORD] ") + chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`));
    try {
        let commandFile = require(`../commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        if (err instanceof Error && err.code === "MODULE_NOT_FOUND") {
            return;
        }
    }
};