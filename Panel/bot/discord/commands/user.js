const axios = require("axios");
const validator = require('validator');
exports.run = async (client, message, args) => {

    //Random password gen
    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var getPassword = () => {

        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };


    if (!args[0]) {
        //No args, Help
        const embed = new Discord.MessageEmbed()
            .addField("__**Commands**__`", config.DiscordBot.Prefix + "user new` | Create an account \n`" + config.DiscordBot.Prefix + "user password` | Reset account password \n`" + config.DiscordBot.Prefix + "user link` | Link this account with console account \n`" + config.DiscordBot.Prefix + "user unlink` | Unlinks account from the console account \n`" + config.DiscordBot.Prefix + "user premium` | Check your premium server limit")
        await message.channel.send(embed)
    } else if (args[0].toLowerCase() === "new") {
        if (userData.get(message.author.id) == null) {
            const server = message.guild

            let channel = await server.channels.create(message.author.tag, "text", [{
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
            message.reply(`Please check <#${channel.id}> to create an account.`)

            let category = server.channels.cache.find(c => c.id === settings.fetch("accountcategory.id") && c.type === "category");
            if (!category) throw new Error("Category channel does not exist");

            await channel.setParent(category.id);

            channel.updateOverwrite(message.author, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            })


            const filter2 = m => m.author.id === message.author.id;

            let msg = await channel.send("<@" + message.author.id + ">", {
                embed: new Discord.MessageEmbed()
                    .setColor(0x36393e)
                    .setDescription("Please enter a username (**Please dont use spaces or special characters**)")
                    .setFooter("You can type 'cancel' to cancel the request")
            })

            const data = {
                "username": null,
                "email": null,
                "first_name": null,
                "last_name": ".",
                "password": null,
                "root_admin": false,
                "language": "en"
            }

            //First Collection "UserName"
            try {
                let collected1 = await channel.awaitMessages(filter2, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })

                if (collected1.first().content.toLowerCase() === 'cancel') {
                    return msg.edit("Request to create a new user has been canceled!", null).then(() => channel.delete())
                }

                data.username = collected1.first().content.toLowerCase();
                data.first_name = collected1.first().content;

                await msg.edit("", {
                    embed: new Discord.MessageEmbed()
                        .setColor(0x36393e)
                        .setDescription(`Username: **${collected1.first().content.toLowerCase()}** \nPlease enter a Email.`)
                        .setFooter("You can type 'cancel' to cancel the request")
                })

                collected1.first().delete();

                //scnd Collection "Email"

                let collected2 = await channel.awaitMessages(filter2, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                })

                if (collected2.first().content.toLowerCase() === 'cancel') {
                    return msg.edit("Request to create a new user has been canceled!", null).then(() => channel.delete())
                }

                if (!validator.isEmail(collected2.first().content.toLowerCase().trim())) {
                    msg.delete()
                    channel.send(`\`${collected2.first().content.toLowerCase().trim()}` + "` is not a Valid Email!");
                    setTimeout(() => {
                        channel.delete();
                    }, 10000);
                    return;
                }
                data.email = collected2.first().content.toLowerCase().trim();
                collected2.first().delete();

            } catch (error) {
                console.log(error);
                msg.delete()
                channel.send(`ERROR: User failed to provide an answer.`);
                setTimeout(() => {
                    channel.delete();
                }, 3000);
            }

            let password = getPassword();

            data.password = password;

            axios({
                url: config.Pterodactyl.hosturl + "/api/application/users",
                method: 'POST',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                },
                data: data,
            }).then(user => {

                const timestamp = `${moment().format("HH:mm:ss")}`;
                const datestamp = `${moment().format("YYYY-MM-DD")}`;

                userData.set(`${message.author.id}`, {
                    discordID: message.author.id,
                    consoleID: user.data.attributes.id,
                    email: user.data.attributes.email,
                    username: user.data.attributes.username,
                    linkTime: timestamp,
                    linkDate: datestamp,
                    domains: []
                })
console.log(user)
                if (user === "Error: User already exists! (Or Email/Username is in use already)") {
                    console.log(user)
                    channel.send("ERROR: A user with that email/username already exists.", null)
                    setTimeout(function () {
                        channel.delete();
                    }, 10000);
                    return false;
                }

                msg.edit("Hello! You created an new account, Heres the login information", {
                    embed: new Discord.MessageEmbed()
                        .setColor(0x36393e)
                        .setDescription("URL: " + config.Pterodactyl.hosturl + " \nUsername: " + data.username + " \nEmail: " + data.email + " \nPassword: " + password)
                        .setFooter("Please note: It is recommended that you change the password")
                })

                channel.send('**You have 30mins to keep note of this info before the channel is deleted.**')
                message.guild.members.cache.get(message.author.id).addRole("639489891016638496");
                setTimeout(function () {
                    channel.delete();
                }, 1800000);

            }).catch(err => {
                if (err === "Error: User already exists! (Or Email/Username is in use already)") {
                    msg.edit("ERROR: A user with that email/username already exists.", null)
                    setTimeout(function () {
                        channel.delete();
                    }, 10000);
                }
            })
        } else {
            let embed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
                .addField(`__**Linked Date (DD/MM/YY)**__`, userData.fetch(message.author.id + ".linkDate"))
                .addField(`__**Linked Time**__`, userData.fetch(message.author.id + ".linkTime"))
            message.channel.send("You already have an account!", embed)
        }
    } else if (args[0].toLowerCase() === "password") {
        //Password reset
        let password = await getPassword();
        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID,
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
        }).then(fetch => {
            console.log(fetch.data.attributes)
            const data = {
                "email": fetch.data.attributes.email,
                "username": fetch.data.attributes.username,
                "first_name": fetch.data.attributes.first_name,
                "last_name": fetch.data.attributes.last_name,
                "password": password
            }
            axios({
                url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID,
                method: 'PATCH',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                },
                data: data,
            }).then(user => {
                message.channel.send('The console account that is linked with the discord account has now been reset. Please check dms for the password. \nA email will also be sent containing the new password')
                client.users.get(message.author.id).send(`New password for DanBot Hosting: ||**${data.password}**||`)

                const emailmessage = {
                    from: config.Email.From,
                    to: messagecollected.content,
                    subject: 'DanBot Hosting - Password reset via bot',
                    html: "Hello, the console account password for email: " + userData.get(message.author.id).email + " was just reset. here is the new password" + data.password
                };
                transport.sendMail(emailmessage);
            }).catch(err => {
                message.channel.send(err)
            })
        })

    } else if (args[0].toLowerCase() === "link") {
        //Link account
        if (userData.get(message.author.id) == null) {

            const server = message.guild

            let channel = await server.channels.create(message.author.tag, "text", [{
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

            let category = server.channels.cache.find(c => c.id === "738539016688894024" && c.type === "category");
            if (!category) throw new Error("Category channel does not exist");

            await channel.setParent(category.id);

            channel.updateOverwrite(message.author, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            })



            let msg = await channel.send(message.author, {
                embed: new Discord.MessageEmbed()
                    .setColor(0x36393e)
                    .setDescription("Please enter your console email address")
                    .setFooter("You can type 'cancel' to cancel the request \n**This will take a few seconds to find your account.**")
            })

            const collector = new Discord.MessageCollector(channel, m => m.author.id === message.author.id, {
                time: 60000,
                max: 1
            });
            collector.on('collect', messagecollected => {
                //console.log(message.content)

                if (messagecollected.content === 'cancel') {
                    return msg.edit("Request to link your account canceled.", null).then(channel.delete())
                }

                const axios = require('axios');
                let arr = [];

                axios({
                    url: "https://panel.danbot.host" + "/api/application/users",
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(resources => {
                    let countmax = resources.data.meta.pagination.total_pages
                    let i2 = countmax++

                    let i = 0
                    while (i < i2) {
                        axios({
                            url: "https://panel.danbot.host" + "/api/application/users?page=" + i,
                            method: 'GET',
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                                'Content-Type': 'application/json',
                                'Accept': 'Application/vnd.pterodactyl.v1+json',
                            }
                        }).then(response => {
                            arr.push(...response.data.data)
                        });
                        i++
                    }
                    console.log(resources.data.meta.pagination)
                    let total = resources.data.meta.pagination.total
                });
                //Find account then link
                setTimeout(async () => {
                    console.log(arr.length)
                    const consoleUser = arr.find(usr => usr.attributes ? usr.attributes.email === messagecollected.content : false);

                    if (!consoleUser) {
                        channel.send('I can\'t find a user with that account! \nRemoving channel!')
                        setTimeout(() => {
                            channel.delete();
                        }, 5000)
                    } else {

                        function codegen(length) {
                            let result = '';
                            let characters = '23456789';
                            let charactersLength = characters.length;
                            for (let i = 0; i < length; i++) {
                                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                            }
                            return result;
                        }
                        const code = codegen(10);

                        const emailmessage = {
                            from: config.Email.From,
                            to: messagecollected.content,
                            subject: 'DanBot Hosting - Someone tried to link their Discord account!',
                            html: "Hello, " + message.author.username + " (ID: " + message.author.id + ") just tried to link their Discord account with this console email address. Here is a verification code that is needed to link: " + code
                        };
                        transport.sendMail(emailmessage, function (err, info) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(info);
                                channel.send('Please check the email account for a verification code to complete linking. You have 2mins')

                                const collector = new Discord.MessageCollector(channel, m => m.author.id === message.author.id, {
                                    time: 120000,
                                    max: 2
                                });
                                collector.on('collect', message => {
                                    if (message.content === code) {
                                        const timestamp = `${moment().format("HH:mm:ss")}`;
                                        const datestamp = `${moment().format("YYYY-MM-DD")}`;
                                        userData.set(`${message.author.id}`, {
                                            discordID: message.author.id,
                                            consoleID: consoleUser.attributes.id,
                                            email: consoleUser.attributes.email,
                                            username: consoleUser.attributes.username,
                                            linkTime: timestamp,
                                            linkDate: datestamp,
                                            domains: []
                                        });

                                        let embedstaff = new Discord.MessageEmbed()
                                            .setColor('Green')
                                            .addField('__**Linked Discord account:**__', message.author.id)
                                            .addField('__**Linked Console account email:**__', consoleUser.attributes.email)
                                            .addField('__**Linked At: (TIME / DATE)**__', timestamp + " / " + datestamp)
                                            .addField('__**Linked Console username:**__', consoleUser.attributes.username)
                                            .addField('__**Linked Console ID:**__', consoleUser.attributes.id)

                                        channel.send("Account linked!").then(
                                            client.channels.get(config.DiscordBot.oLogs).send(`<@${message.author.id}> linked their account. Heres some info: `, embedstaff),
                                            setTimeout(() => {
                                                channel.delete();
                                            }, 5000)
                                        );
                                    } else {
                                        channel.send('Code is incorrect. Linking cancelled! \n\nRemoving channel!')
                                        setTimeout(() => {
                                            channel.delete();
                                        }, 2000)
                                    }
                                });
                            }
                        });

                    };
                }, 10000)

            })
        } else {
            let embed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .addField(`__**Username**__`, userData.fetch(message.author.id + ".username"))
                .addField(`__**Linked Date (DD/MM/YY)**__`, userData.fetch(message.author.id + ".linkDate"))
                .addField(`__**Linked Time**__`, userData.fetch(message.author.id + ".linkTime"))
            message.channel.send("This account is linked!", embed)
        }
    } else if (args[0].toLowerCase() === "unlink") {
        userData.delete(message.author.id)
        message.channel.send('You have unlinked this account!')
    } else if (args[0].toLowerCase() === "invites") {
        let targetUser = null;
        let isAnotherUserLookup = false;
        if (message.mentions.members.first() != null) {
            targetUser = message.mentions.members.first().user;
            console.log(targetUser.user);
            isAnotherUserLookup = true;
        } else
            targetUser = message.author;

        message.guild.fetchInvites()
            .then(invites => {
                const userInvites = invites.array().filter(o => o.inviter.id === targetUser.id);
                var userInviteCount = 0;
                for (var i = 0; i < userInvites.length; i++) {
                    var invite = userInvites[i];
                    userInviteCount += invite['uses'];
                }
                if (isAnotherUserLookup)
                    message.channel.send(`User \`_${targetUser.username}_\` has invited ${userInviteCount} users`);
                else
                    message.reply(`You have invited ${userInviteCount} users to this server. `);
            })
            .catch(console.error);


    } else if (args[0].toLowerCase() === "premium") {
        let user = userPrem.fetch(message.author.id);
        if (user == null) {
            message.channel.send('You are not a premium user')
        } else {
            let allowed = Math.floor(user.donated / config.node7.price);
            if (message.member.roles.cache.get('710208090741539006') != null) allowed = allowed + (user.boosted != null ? Math.floor(user.boosted * 2.5) : 2);
            const embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .addField('Premium servers used:', user.used + " out of  " + allowed + " servers used")
            await message.channel.send(embed)
        }
    }
};