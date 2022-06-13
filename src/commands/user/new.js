const config = require("../../config.json");
const { Client, Message, MessageEmbed } = require("discord.js");
const UserSchema = require("../../utils/Schemas/User");
const bycrypt = require("bcrypt");
const createUser = require("../../utils/pterodactyl/user/create");

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const userRegex = /^[a-zA-Z0-9_]+$/;

const passwordGen = (length) => {
    const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }

    return password;
}

module.exports = {
    name: "new",
    description: "Make a new account",
    usage: "new",
    example: "new",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.userCommandsEnabled,
        error: "The user commands are disabled!"
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const userCategory = client.channels.cache.get(config.discord.categories.userCreation);

        if (!userCategory) {
            message.reply("The user category does not exist! Please contact a admin!");
            return;
        }

        const user = await UserSchema.findOne({ userId: message.author.id });

        if (user) {
            message.reply("You already have an account!");
            return;
        }

        for (const chan of message.guild.channels.cache.values()) {
            if (chan.name !== `${message.author.tag.replace("#", "-").toLowerCase()}` && chan?.parentId !== config.discord.categories.userCreation) continue;

            chan.delete()
        }

        const chan = await userCategory.createChannel(`${message.author.username}-${message.author.discriminator}`, {
            type: "text",
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                }, {
                    id: message.author.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                },
            ],
        }).catch(console.error);

        message.reply(`Please check ${chan} to create an account!`)

        let questions = [{
            question: "What is your email?",
            time: 300000,
            value: null,
            afterChecks: [{
                check: (value) => emailRegex.test(value),
                message: "Please enter a valid email!",
            }]
        }, {
            question: "What is your username? (Username Can Only Include from a-z, A-Z, 0-9, _)",
            time: 300000,
            value: null,
            afterChecks: [{
                check: (value) => userRegex.test(value),
                message: "Please enter a valid username!"
            }]
        }]

        let creationEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setFooter({
                text: "You can type 'cancel' to cancel the creation process!",
            })

        const msg = await chan.send({ content: `${message.author}`, embeds: [creationEmbed] })

        for (const question of questions) {

            creationEmbed.description = question.question;

            await msg.edit({ embeds: [creationEmbed] })

            const collectedMsgs = await chan.awaitMessages({
                filter: m => m.author.id === message.author.id,
                time: question.time,
                max: 1,
            });

            const collectedMsg = collectedMsgs?.first()?.content?.trim();

            if (collectedMsgs?.first()) collectedMsgs?.first()?.delete()

            if (!collectedMsg) {
                chan.send("You took too long to answer the question!");
                chan.send(`Account creation failed!`);

                setTimeout(() => {
                    chan.delete();
                }, 5000);
                return;
            }

            if (collectedMsg.toLowerCase() === "cancel") {
                chan.send("You have cancelled the creation process!");
                return;
            }

            question.value = collectedMsg;

            for (const check of question.afterChecks) {
                if (!check.check(question.value)) {
                    chan.send(check.message);
                    chan.send(`Account creation failed!`);

                    setTimeout(() => {
                        chan.delete();
                    }, 5000);

                    return;
                }
            }

        }

        const salt = await bycrypt.genSalt(15);

        const hash = await bycrypt.hash(questions[0].value, salt);

        const emailCheck = await UserSchema.findOne({ email: hash });
        const usernameCheck = await UserSchema.findOne({ username: questions[1].value });

        if (emailCheck) {
            chan.send("That email is already in use! Please link your account instead!");
            chan.send(`Account creation failed!`);

            setTimeout(() => {
                chan.delete();
            }, 5000);
            return;
        }

        if (usernameCheck) {
            chan.send("That username is already in use! Please try another username!");
            chan.send(`Account creation failed!`);

            setTimeout(() => {
                chan.delete();
            }, 5000);
            return;
        }

        const data = {
            "username": questions[1].value.toLowerCase(),
            "email": questions[0].value,
            "first_name": message.author.tag,
            "last_name": message.author.id,
            "password": passwordGen(12),
            "root_admin": false,
            "language": "en"
        }

        creationEmbed.description = "Creating Account Please wait...";
        creationEmbed.footer = null;

        await msg.edit({ embeds: [creationEmbed] })

        const resData = await createUser(data);

        if (resData.error) {
            chan.send(`Account creation failed!\n\n${resData.data}`);

            setTimeout(() => {
                chan.delete();
            }, 5000);
            return;
        }

        await UserSchema.create({
            userId: message.author.id,
            consoleId: resData.data.attributes.id,
            email: hash,
            username: questions[1].value.toLowerCase(),
            domains: [],
            linkDate: Date.now(),
        })

        const logEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("User Created")
            .setDescription(`${message.author} has created an account!`)
            .addField("Username", questions[1].value.toString())

        const logChan = message.guild.channels.cache.get(config.discord.channels.userLogs)

        if (logChan) {
            logChan.send({ embeds: [logEmbed] })
        }

        creationEmbed.description = `Panel: ${config.pterodactyl.panelUrl}\nUsername: ${data.username}\nEmail: ${data.email}\nPassword: ${data.password}`;
        creationEmbed.footer = { text: `A dm with this info has also been sent` };

        await msg.edit({ embeds: [creationEmbed] })
        message.author.send({ embeds: [creationEmbed] })

        setTimeout(() => {
            chan.delete();
        }, 600000)

        return;
    },
}