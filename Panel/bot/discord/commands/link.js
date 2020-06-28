var path = require("path")
var fs = require("fs")
const moment = require("moment");
exports.run = async (client, message) => {

    const args = message.content.split(' ').slice(1).join(' ');

    let result = userData.get(message.author.id)
    if (userData.get(message.author.id) == null) {
    if (message.member.roles.find(r => r.id === "639489891016638496")) {

        const server = message.guild

        let channel = await server.createChannel(message.author.tag, "text", [{
                type: 'role',
                id: message.guild.id,
                deny: 0x400
            },
            {
                type: 'user',
                id: message.author.id,
                deny: 1024
            }
        ]).catch(console.error);
        message.reply(`Please check <#${channel.id}> to link your account.`)

        let category = server.channels.find(c => c.id == "697585283214082078" && c.type == "category");
        if (!category) throw new Error("Category channel does not exist");

        await channel.setParent(category.id);

        channel.overwritePermissions(message.author, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })


        const filter2 = m => m.author.id === message.author.id;

        let msg = await channel.send(message.author, {
            embed: new Discord.RichEmbed()
                .setColor(0x36393e)
                .setDescription("Please enter your console email address")
                .setFooter("You can type 'cancel' to cancel the request")
        })

        let collected1 = await channel.awaitMessages(filter2, {
            max: 1,
            time: 60000,
            errors: ['time'],
        }).catch(x => {
            msg.delete()
            channel.send(`ERROR: User failed to provide an answer.`);
            setTimeout(() => {
                channel.delete();
            }, 3000);
            return false;
        })

        if (collected1.first().content === 'cancel') {
            return msg.edit("Request to link your account canceled.", null).then(channel.delete())
        }

        let consoleUser3 = await DanBotHosting.getAllUsers();
        console.log(consoleUser3)
        consoleUser2 = consoleUser3.filter(x => x.attributes.email == collected1.first().content.trim())
        console.log(consoleUser2)

        if (consoleUser2.length == 0) return channel.send("No account with that email exists...").then(
            setTimeout(() => {
                channel.delete();
            }, 5000)
        )

        consoleUser = consoleUser2[0];
        const timestamp = `${moment().format("HH:mm:ss")}`;
        const datestamp = `${moment().format("YYYY-MM-DD")}`;
        userData.set(`${message.author.id}`, {
            discordID: message.author.id,
            consoleID: consoleUser.attributes.id,
            email: consoleUser.attributes.email,
            username: consoleUser.attributes.username,
            linkTime: timestamp,
            linkDate: datestamp
        })

        let embedstaff = new Discord.RichEmbed()
        .setColor('GREEN')
        .addField('__**Linked Discord account:**__', message.author.id)
        .addField('__**Linked Console account email:**__', consoleUser.attributes.email)
        .addField('__**Linked At: (TIME / DATE)**__', timestamp + " / " + datestamp)
        .addField('__**Linked Console username:**__', consoleUser.attributes.username)
        .addField('__**Linked Console ID:**__', consoleUser.attributes.id)

            channel.send("Account linked! You can now create server's and use other features on this bot!").then(
                client.channels.get(config.DiscordBot.mLogs).send(`<@${message.author.id}> linked their account. Heres some info: `, embedstaff),
                setTimeout(() => {
                    channel.delete();
                }, 5000)
        )


    }
} else {
    let embed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
            .addField(`__**Date (DD/MM/YY)**__`, userData.fetch(message.author.id + ".linkDate"))
            .addField(`__**Time**__`, userData.fetch(message.author.id + ".linkTime"))
    message.channel.send("You'r account is already linked. ", embed)
}
}