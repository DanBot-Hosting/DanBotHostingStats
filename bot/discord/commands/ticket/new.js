exports.run = async (client, message, args) => {
    if (message.guild.channels.cache.find(channel => channel.name === `${message.author.username.toString().toLowerCase() + message.author.tag}-ticket`)) return
    const server = message.guild

    let channel = await server.channels.create(message.author.username + message.author.tag + "-Ticket", "text", [{
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
            id: "748117822370086932",
            allow: 84992
        }
    ]).catch((err) => {
        console.log(err)
    });
    message.reply(`Please check <#${channel.id}> for your ticket.`)

    let category = server.channels.cache.find(c => c.id === "738538742603841650" && c.type === "category");
    if (!category) throw new Error("Category channel does not exist");

    let categorybackup = server.channels.cache.find(c => c.id === "741082659610034257" && c.type === "category");
    if (!categorybackup) throw new Error("Category channel does not exist");

    let categorybackup2 = server.channels.cache.find(c => c.id === "864581561830604810" && c.type === "category");
    if (!categorybackup2) throw new Error("Category channel does not exist");

    await channel.setParent(category.id).catch(channel.setParent(categorybackup.id).catch(channel.setParent(categorybackup2.id).catch(console.error)));

    setTimeout(() => {
        channel.updateOverwrite(message.author, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })
        channel.updateOverwrite("748117822370086932", {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })

    }, 1000)

    if (userData.get(message.author.id) == null) {
        channel.send('<@' + message.author.id + '> here is your ticket! Please give as much info as possible about your problem.\n\n ***Remember, Pinging staff won\'t Fix your problem Faster. Please Just wait until someone helps you!*** \n\n *This account is not linked with a console account*')
    } else {
        let embed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
            .addField(`__**Email**__`, "||`" + userData.fetch(message.author.id + ".email") + "`||")
            .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(message.author.id + ".linkDate"))
            .addField(`__**Time**__`, userData.fetch(message.author.id + ".linkTime"))
        channel.send('<@' + message.author.id + '> here is your ticket! Please give as much info as possible about your problem.\n\n ***Remember, Pinging staff won\'t Fix your problem Faster. Please Just wait until someone helps you!***\n\n *This account is linked with:* ', embed)
    }
}
