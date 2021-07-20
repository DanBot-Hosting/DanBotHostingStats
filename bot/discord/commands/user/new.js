const axios = require("axios");
const validator = require('validator');
exports.run = async (client, message, args) => {

    let getPassword = () => {

        const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var password = "";
        while (password.length < 10) {
            password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
        }
        return password;
    };

    if (userData.get(message.author.id) != null) {
        message.reply("You already have a `panel account` linked to your discord account");
        return;
    }

    let questions = [{
        id: "username",
        question: "What should your username be? (**Please dont use spaces or special characters**)", // The questions...
        filter: (m) => m.author.id === message.author.id, // Filter to use...
        afterChecks: [{
            check: (msg) => msg.trim().split(" ").length == 1,
            errorMessage: "username must not contain any spaces",
        }],
        time: 30000, // how much time a user has to answer the question before it times out
        value: null // The user's response.
    }, {
        id: "email",
        question: "Whats your email? *(must be a valid email)*",
        filter: (m) => m.author.id === message.author.id,
        afterChecks: [{
            check: (msg) => validator.isEmail(msg.toLowerCase().trim()),
            errorMessage: "the email must be valid.",
        }],
        time: 30000,
        value: null
    }]

    // Locate the account creation category
    let category = message.guild.channels.cache.find(c => c.id === settings.fetch("accountcategory.id") && c.type === "category");

    // if not found throw an error
    if (!category) throw new Error("Category channel does not exist");

    // Create the channel in which the user will use to create his account
    let channel = await message.guild.channels.create(message.author.tag, {
        parent: category.id,
        permissionOverwrites: [{
                id: message.author.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
            },
            {
                id: message.guild.id,
                deny: 0x400
            }
        ]
    }).catch(console.error);

    channel.updateOverwrite(message.author, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true
    })

    // Tell the user to check the channel.
    message.reply(`Please check <#${channel.id}> to create an account.`);

    //Send the initial question.

    let msg = null;

    for (const question of questions) {

        if (msg == null) {
            msg = await channel.send(message.member, {
                embed: new Discord.MessageEmbed()
                    .setColor(0x36393e)
                    .setDescription(question.question)
                    .setFooter("You can type 'cancel' to cancel the request")
            });
        } else {
            msg.edit({
                content: message.member,
                embeds: [msg.embeds[0].setDescription(question.question)]
            });
        }

        let awaitMessages = await channel.awaitMessages(question.filter, {
            max: 1,
            time: question.time,
            errors: ['time'],
        }).catch(x => {
            channel.send("User failed to provide an input!\nAccount Cancelled! :thumbsup:");
            setTimeout(() => {
                channel.delete();
            }, 5000);
            return;
        });
        // Log the value...
        question.value = awaitMessages.first().content.trim();

        await awaitMessages.first().delete();

        if (question.value == 'cancel') {

            msg.delete();
            channel.send("Cancelled! :thumbsup:");

            setTimeout(() => {
                channel.delete();
            }, 5000);
            return;
        }

        for (const aftercheck of question.afterChecks) {
            if (aftercheck.check(question.value) == false) {
                channel.send(aftercheck.errorMessage);
                channel.send("Account Cancelled! :thumbsup:");
                setTimeout(() => {
                    channel.delete();
                }, 5000);
                return;
            };
        }

    }

    msg.edit({
        content: message.member,
        embeds: [msg.embeds[0]
            .setDescription('Attempting to create an account for you...\n\n>>> ' + questions.map(question => `**${question.id}:** ${question.value.toLowerCase()}`).join('\n'))
            .setFooter('').setTimestamp()
        ]
    });


    const data = {
        "username": questions.find(question => question.id == 'username').value.toLowerCase(),
        "email": questions.find(question => question.id == 'email').value.toLowerCase(),
        "first_name": questions.find(question => question.id == 'username').value,
        "last_name": ".",
        "password": getPassword(),
        "root_admin": false,
        "language": "en"
    }


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
        userData.set(`${message.author.id}`, {
            discordID: message.author.id,
            consoleID: user.data.attributes.id,
            email: user.data.attributes.email,
            username: user.data.attributes.username,
            linkTime: moment().format("HH:mm:ss"),
            linkDate: moment().format("YYYY-MM-DD"),
            domains: []
        })

        msg.edit({
            content: "Hello! You created an new account, Heres the login information",
            embeds: [new Discord.MessageEmbed()
                .setColor("GREEN")
                .setDescription("URL: " + config.Pterodactyl.hosturl + " \nUsername: " + data.username + " \nEmail: " + data.email + " \nPassword: " + data.password)
                .setFooter("Please note: It is recommended that you change the password")
            ]
        })

        channel.send('**You have 30mins to keep note of this info before the channel is deleted.**')
        message.guild.members.cache.get(message.author.id).roles.add("639489891016638496");
        setTimeout(function() {
            channel.delete();
        }, 1800000);
    }).catch(err => {
        let errors = err.response.data.errors;

        if (errors) {
            msg.edit({
                content: '',
                embeds: [new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("An error has occured:")
                    .setDescription("**ERRORS:**\n\n●" + errors.map(error => error.detail.replace('\n', ' ')).join('\n●'))
                    .setTimestamp().setFooter('Deleting in 30 seconds...')
                ]
            })
            setTimeout(function() {
                channel.delete();
            }, 30000);
        } else {
            channel.send('an unexpected error has occured, please try again later...');
            setTimeout(function() {
                channel.delete();
            }, 30000);
        }
    })
}