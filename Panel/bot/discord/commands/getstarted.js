exports.run = async (client, message) => {
    //Args
    const args = message.content.split(' ').slice(1).join(' ');
    var validator = require('validator');

    //Random password gen
    var CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let getPassword = () => {

        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    if (args == "") {
        let embed = new Discord.RichEmbed()
            .setColor(`BLUE`)
            .addField(`__**How to get started!**__`, 'Create an account by typing: `' + config.DiscordBot.Prefix + 'getstarted account` \nOnce done run `' + config.DiscordBot.Prefix + 'getstarted server` to create a server! \n \nAny problems? Please send a message in <#640158951899398144>', true);
        message.channel.send(embed)

    } else if (args == "account") {
        if (userData.get(message.author.id) == null) {
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
        message.reply(`Please check <#${channel.id}> to create an account.`)

        let category = server.channels.find(c => c.id == "738539016688894024" && c.type == "category");
        if (!category) throw new Error("Category channel does not exist");

        await channel.setParent(category.id);

        channel.overwritePermissions(message.author, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true
        })


        const filter2 = m => m.author.id === message.author.id;

        let msg = await channel.send("<@" + message.author.id + ">", {
            embed: new Discord.RichEmbed()
                .setColor(0x36393e)
                .setDescription("Please enter a username (**Please dont use spaces**)")
                .setFooter("You can type 'cancel' to cancel the request")
        })

        //First Collection "UserName"

        let collected1 = await channel.awaitMessages(filter2, {
            max: 1,
            time: 30000,
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
            return msg.edit("Request to create a new user has been canceled!", null).then(channel.delete())
        }

        await msg.edit("", {
            embed: new Discord.RichEmbed()
                .setColor(0x36393e)
                .setDescription(`Username: **${collected1.first().content}** \nPlease enter a Email.`)
                .setFooter("You can type 'cancel' to cancel the request")
        })
        collected1.first().delete();

        //scnd Collection "Email"

        let collected2 = await channel.awaitMessages(filter2, {
            max: 1,
            time: 30000,
            errors: ['time'],
        }).catch(x => {
            msg.delete()
            channel.send(`ERROR: User failed to provide an answer.`);
            setTimeout(() => {
                channel.delete();
            }, 3000);
            return false;
        })


        if (collected2.first().content === 'cancel') {
            channel.delete()
        }

        if (!validator.isEmail(collected2.first().content.trim())) {
            msg.delete()
            channel.send(`\`${collected2.first().content.trim()}`+"` is not a Valid Email!");
            setTimeout(() => {
                channel.delete();
            }, 10000);
            return false;
        }
        collected2.first().delete();

        let password = await getPassword();

        DanBotHosting.createUser(collected1.first().content, password, collected2.first().content, collected1.first().content, ".", false, "en").then(user => {
            console.log(user)

                const timestamp = `${moment().format("HH:mm:ss")}`;
                const datestamp = `${moment().format("YYYY-MM-DD")}`;
                userData.set(`${message.author.id}`, {
                    discordID: message.author.id,
                    consoleID: user.id,
                    email: user.email,
                    username: user.username,
                    linkTime: timestamp,
                    linkDate: datestamp
                })

            if (user == "Error: User already exists! (Or Email/Username is in use already)") {
                msg.edit("ERROR: A user with that email/username already exists.", null)
                setTimeout(function () {
                    channel.delete();
                }, 10000);
                return false;
            }
                msg.edit("Hello! You created an new account, Heres the login information", {
                    embed: new Discord.RichEmbed()
                        .setColor(0x36393e)
                        .setDescription("URL: " + config.Pterodactyl.hosturl + " \nUsername: " + collected1.first().content + " \nEmail: " + collected2.first().content + " \nPassword: " + password)
                        .setFooter("Please note: It is recommended that you change the password")
                })
                channel.send('**You have 1Hour to keep note of this info before the channel is deleted.**')
                message.guild.members.get(message.author.id).addRole("639489891016638496");
                setTimeout(function () {
                    channel.delete();
                }, 3600000);

        }).catch(err => {
            if (err = "Error: User already exists! (Or Email/Username is in use already)") {
                msg.edit("ERROR: A user with that email/username already exists.", null)
                setTimeout(function () {
                    channel.delete();
                }, 10000);
            }
        })
        } else {
            message.channel.send('You already have an account')
        }
    } else if (args == "server") {
        message.channel.send('Please use `' + config.DiscordBot.Prefix + "server create type servername` \nTo see server types please do: `" + config.DiscordBot.Prefix + "server create list`")

        const filter2 = m => m.author.id === message.author.id;
        /*        const filter2 = m => m.author.id === message.author.id;
                message.channel.send("", {
                    embed: new Discord.RichEmbed()
                        .setColor(0x36393e)
                        .setDescription("NodeJS Or Minecraft?")
                        .setFooter("You can type 'cancel' to cancel the request")
                }).then((message2) => {
                        message2.channel.awaitMessages(filter2, {
                            max: 1,
                            time: 20000,
                            errors: ['time'],
                        }).then((collected1) => {
                            if (collected1.first().content === 'cancel') {
                                message.channel.bulkDelete(3)
                                return message.reply("Request to create a server has been canceled!").then(q => q.delete(5000))
                    }
                    if (collected1.first().content.toLowercase == "Minecraft") {
                            message2.channel.send("", {
                                embed: new Discord.RichEmbed()
                                    .setColor(0x36393e)
                                    .setDescription(`Minecraft Server Version? (Example: 1.15.2)`)
                                    .setFooter("You can type 'cancel' to cancel the request")
                            }).then((message3) => {
                                message3.channel.awaitMessages(filter2, {
                                    max: 1,
                                    time: 20000,
                                    errors: ['time'],
                                }).then((collected2) => {
                                    if (collected2.first().content === 'cancel') {
                                        message.channel.bulkDelete(5)
                                        return message.reply("Request to create a new user has been canceled!").then(q => q.delete(5000))
                                    }
            
                    DanBotHosting.createUser(collected1.first().content, password, collected2.first().content, collected1.first().content, ".", false, "en").then(user => {
                        console.log(user)
                        if (user == "Error: User already exists! (Or Email/Username is existing already)") {
                            message.channel.send("ERROR: A user with that email/username already exists.");
                            message.channel.bulkDelete(5);
                        } else {
                            message.author.send("Hello! You created an new account, Heres the login information", {
                                embed: new Discord.RichEmbed()
                                    .setColor(0x36393e)
                                    .setDescription("URL: " + config.Pterodactyl.hosturl + " \nUsername: " + collected1.first().content + " \nEmail: " + collected2.first().content + " \nPassword: " + password)
                                    .setFooter("Please note: It is recommended that you change the password")
                            })
                            message.channel.bulkDelete(5);
            
                        }
                    }).catch(err => {
                        console.log(err);
            
            
                    })
                                })
                            })
                        } else if (collected1.first().content.toLowercase == "NodeJS") {
                            message.channel.send("**Created!**")
                        } 
                    })
                })
            */
    } //End of ifs

};