exports.run = async (client, message) => {
    const args = message.content.split(' ').slice(1).join(' ');
    const user = message.content.split(' ').slice(2).join(' ');

    if (args == "") {
        let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Tickets**__`, 'You can create a new ticket by typing: `' + config.DiscordBot.Prefix + 'ticket new` \nYou can download your old tickets by running: `' + config.DiscordBot.Prefix + 'ticket logs` \nYou can close your ticket by running: `' + config.DiscordBot.Prefix + 'ticket close` \n\nAny problems? Please send a message in <#640158951899398144>', true);
        message.channel.send(embed)

    } else if (args == "new") {
        const server = message.guild

        let channel = await server.createChannel(message.author.username + "-Ticket", "text", [{
                type: 'role',
                id: message.guild.id,
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
        message.reply(`Please check ${channel} for your ticket.`)

        let category = server.channels.find(c => c.id == "654313162086285323" && c.type == "category");
        if (!category) throw new Error("Category channel does not exist");

        await channel.setParent(category.id);

        channel.overwritePermissions(message.author, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })

        if (userData.get(message.author.id) == null) {
            channel.send('@ everyone \n\n <@' + message.author.id + '> here is your ticket! Please give as much info as possible about your problem. \n\n *This account is not linked with a console account*')
        } else  {
            let embed = new Discord.RichEmbed()
                .setColor(`GREEN`)
                .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
                .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(message.author.id + ".linkDate"))
                .addField(`__**Time**__`, userData.fetch(message.author.id + ".linkTime"))
                channel.send('@ everyone \n\n <@' + message.author.id + '> here is your ticket! Please give as much info as possible about your problem. \n\n *This account is linked with:* ', embed)
        }
    } else if (args == "close") {
        if (message.channel.name.includes('-ticket')) {
            const filter2 = m => m.author.id === message.author.id;
            const warning = await message.channel.send('<@' + message.author.id + '> are you sure you want to close this ticket? please type `confirm` to close the ticket or `cancel` to keep the ticket open.')
            
            let collected1 = await message.channel.awaitMessages(filter2, {
                time: 30000,
                errors: ['time'],
            }).catch(x => {
                warning.delete()
                message.channel.send(`ERROR: User failed to provide an answer. Ticket staying open.`);
                setTimeout(() => {
                    message.channel.delete();
                }, 3000);
                return false;
            })
    
            if (collected1.first().content.toLowerCase() === 'confirm') {
                return message.channel.send("**Closing ticket.**", null).then(setTimeout(() => { message.channel.delete()}, 5000))
            } else if (collected1.first().content === 'cancel') {
                return message.channel.send('Closing ticket. __**Canceled**__ Ticket staying open.');
            }
        } else if (message.channel.name.includes('-modmail')) {
            const filter2 = m => m.author.id === message.author.id;
            const warning = await message.channel.send('<@' + message.author.id + '> are you sure you want to close this ticket? please type `confirm` to close the ticket or `cancel` to keep the ticket open.')
            
            let collected1 = await message.channel.awaitMessages(filter2, {
                time: 30000,
                errors: ['time'],
            }).catch(x => {
                warning.delete()
                message.channel.send(`ERROR: User failed to provide an answer. Ticket staying open.`);
                setTimeout(() => {
                    message.channel.delete();
                }, 3000);
                return false;
            })
    
            if (collected1.first().content.toLowerCase() === 'confirm') {
                let userID = db.fetch(`supportChannel_${message.channel.id}`);
                db.delete(`supportChannel_${message.channel.id}`);
                db.delete(`support_${userID}`);
                return message.channel.send("**Closing ticket.**", null).then(setTimeout(() => { message.channel.delete()}, 5000))
            } else if (collected1.first().content === 'cancel') {
                return message.channel.send('Closing ticket. __**Canceled**__ Ticket staying open.');
            }
        } else if (!message.channel.name.includes('-ticket')) {
            message.channel.send('ERROR: You can only use this command in ticket channels.')
    
        }
    } else if (args == "add") {
        if (message.channel.name.includes('-ticket')) {
            if (!args[1] == "") {
                message.channel.send('Please run this command again with the users ID')
            } else {
                console.log(args[1])
                message.channel.overwritePermissions(args[1], {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true
                })
            }
        } else {
            message.channel.send('This command is only to be used inside of ticket channels.')
        }
    } else if (args == "remove") {
        if (!args[1] == "") {
            message.channel.send('Please run this command again with the users ID')
        } else {
            message.channel.overwritePermissions(args[1], {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: false
            })
        }
    }
};
