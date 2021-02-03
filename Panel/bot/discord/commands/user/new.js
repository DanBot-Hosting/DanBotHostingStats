const axios = require("axios");
const validator = require('validator');
exports.run = async (client, message, args) => {

    message.reply('Temporarily disabled. *further updates will be posted in <#738530520945786921>*')

    // if (userData.get(message.author.id) === null) {
    //     const server = message.guild

    //     let channel = await server.channels.create(message.author.tag, "text", [{
    //         type: 'role',
    //         id: message.guild.id,
    //         deny: 0x400
    //     },
    //         {
    //             type: 'user',
    //             id: message.author.id,
    //             deny: 1024
    //         }
    //     ]).catch(console.error);
    //     message.reply(`Please check <#${channel.id}> to create an account.`)

    //     let category = server.channels.cache.find(c => c.id === settings.fetch("accountcategory.id") && c.type === "category");
    //     if (!category) throw new Error("Category channel does not exist");

    //     await channel.setParent(category.id);

    //     channel.updateOverwrite(message.author, {
    //         VIEW_CHANNEL: true,
    //         SEND_MESSAGES: true,
    //         READ_MESSAGE_HISTORY: true
    //     })


    //     const filter2 = m => m.author.id === message.author.id;

    //     let msg = await channel.send("<@" + message.author.id + ">", {
    //         embed: new Discord.MessageEmbed()
    //             .setColor(0x36393e)
    //             .setDescription("Please enter a username (**Please dont use spaces or special characters**)")
    //             .setFooter("You can type 'cancel' to cancel the request")
    //     })

    //     const data = {
    //         "username": null,
    //         "email": null,
    //         "first_name": null,
    //         "last_name": ".",
    //         "password": null,
    //         "root_admin": false,
    //         "language": "en"
    //     }

    //     //First Collection "UserName"
    //     try {
    //         let collected1 = await channel.awaitMessages(filter2, {
    //             max: 1,
    //             time: 30000,
    //             errors: ['time'],
    //         }).catch(x => {
    //             channel.send(x.message)
    //         })

    //         if (collected1.first().content.toLowerCase() === 'cancel') {
    //             return msg.edit("Request to create a new user has been canceled!", null).then(() => channel.delete())
    //         }

    //         data.username = collected1.first().content.toLowerCase();
    //         data.first_name = collected1.first().content;

    //         await msg.edit("", {
    //             embed: new Discord.MessageEmbed()
    //                 .setColor(0x36393e)
    //                 .setDescription(`Username: **${collected1.first().content.toLowerCase()}** \nPlease enter a Email.`)
    //                 .setFooter("You can type 'cancel' to cancel the request")
    //         })

    //         collected1.first().delete();

    //         //scnd Collection "Email"

    //         let collected2 = await channel.awaitMessages(filter2, {
    //             max: 1,
    //             time: 30000,
    //             errors: ['time'],
    //         }).catch(x => {
    //             channel.send(x.message)
    //         })

    //         if (collected2.first().content.toLowerCase() === 'cancel') {
    //             return msg.edit("Request to create a new user has been canceled!", null).then(() => channel.delete())
    //         }

    //         if (!validator.isEmail(collected2.first().content.toLowerCase().trim())) {
    //             msg.delete()
    //             channel.send(`\`${collected2.first().content.toLowerCase().trim()}` + "` is not a Valid Email!");
    //             setTimeout(() => {
    //                 channel.delete();
    //             }, 10000);
    //             return;
    //         }
    //         data.email = collected2.first().content.toLowerCase().trim();
    //         collected2.first().delete();

    //     } catch (error) {
    //         console.log(error);
    //         msg.delete()
    //         channel.send(`ERROR: User failed to provide an answer.`);
    //         setTimeout(() => {
    //             channel.delete();
    //         }, 3000);
    //     }

    //     let password = getPassword();

    //     data.password = password;

    //     axios({
    //         url: config.Pterodactyl.hosturl + "/api/application/users",
    //         method: 'POST',
    //         followRedirect: true,
    //         maxRedirects: 5,
    //         headers: {
    //             'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
    //             'Content-Type': 'application/json',
    //             'Accept': 'Application/vnd.pterodactyl.v1+json',
    //         },
    //         data: data,
    //     }).then(user => {

    //         const timestamp = `${moment().format("HH:mm:ss")}`;
    //         const datestamp = `${moment().format("YYYY-MM-DD")}`;

    //         userData.set(`${message.author.id}`, {
    //             discordID: message.author.id,
    //             consoleID: user.data.attributes.id,
    //             email: user.data.attributes.email,
    //             username: user.data.attributes.username,
    //             linkTime: timestamp,
    //             linkDate: datestamp,
    //             domains: []
    //         })
    //         console.log(user)
    //         if (user === "Error: User already exists! (Or Email/Username is in use already)") {
    //             console.log(user)
    //             channel.send("ERROR: A user with that email/username already exists.", null)
    //             setTimeout(function () {
    //                 channel.delete();
    //             }, 10000);
    //             return false;
    //         }

    //         msg.edit("Hello! You created an new account, Heres the login information", {
    //             embed: new Discord.MessageEmbed()
    //                 .setColor(0x36393e)
    //                 .setDescription("URL: " + config.Pterodactyl.hosturl + " \nUsername: " + data.username + " \nEmail: " + data.email + " \nPassword: " + password)
    //                 .setFooter("Please note: It is recommended that you change the password")
    //         })

    //         channel.send('**You have 30mins to keep note of this info before the channel is deleted.**')
    //         message.guild.members.cache.get(message.author.id).roles.add("639489891016638496");
    //         setTimeout(function () {
    //             channel.delete();
    //         }, 1800000);

    //     }).catch(err => {
    //         if (err === "Error: User already exists! (Or Email/Username is in use already)") {
    //             msg.edit("ERROR: A user with that email/username already exists.", null)
    //             setTimeout(function () {
    //                 channel.delete();
    //             }, 10000);
    //         }
    //     })
    // } else {
    //     let embed = new Discord.MessageEmbed()
    //         .setColor(`GREEN`)
    //         .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
    //         .addField(`__**Linked Date (DD/MM/YY)**__`, userData.fetch(message.author.id + ".linkDate"))
    //         .addField(`__**Linked Time**__`, userData.fetch(message.author.id + ".linkTime"))
    //     await message.channel.send("You already have an account!", embed)
    // }
}