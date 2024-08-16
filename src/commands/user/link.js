const Discord = require('discord.js');
const axios = require("axios");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');

exports.description = "Połącz swoje konto w panelu z Discordem!";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */
exports.run = async (client, message, args) => {

    // The user does not have a panel account linked and would like to link one.
    if (userData.get(message.author.id) == null) {
        const server = message.guild;

        let channel = await server.channels
            .create(message.author.tag, "text", [
                {
                    type: "role",
                    id: message.guild.id,
                    deny: 0x400,
                },
                {
                    type: "user",
                    id: message.author.id,
                    deny: 1024,
                },
            ])
            .catch(console.error);
        message.reply(`Odwiedź kanał <#${channel.id}>, aby połączyć swoje konto.`);

        let category = server.channels.cache.find(
            (c) => c.id === MiscConfigs.accounts && c.type === "category",
        );

        if (!category) throw new Error("Kategoria nie została odnaleziona.");

        await channel.setParent(category.id);

        channel.updateOverwrite(message.author, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
        });

        let msg = await channel.send(message.author, {
            embed: new Discord.MessageEmbed()
                .setColor(0x36393e)
                .setDescription("Podaj swój adres e-mail z panelu")
                .setFooter(
                    "Napisz 'cancel', aby anulować.\n**Wyszukuję konto w bazie danych.**",
                ),
        });

        const collector = new Discord.MessageCollector(
            channel,
            (m) => m.author.id === message.author.id,
            {
                time: 60000,
                max: 1,
            },
        );
        collector.on("collect", (messagecollected) => {
            if (messagecollected.content === "cancel") {
                return msg
                    .edit("Łączenie konta zostało anulowane.", null)
                    .then(channel.delete());
            }

            // Find account then link
            setTimeout(async () => {
                const consoleUser = users.find((usr) =>
                    usr.attributes ? usr.attributes.email === messagecollected.content : false,
                );

                if (!consoleUser) {
                    channel.send("Nie mogę znaleźć podanych danych w mojej bazie! \nUsuwam kanał!");
                    setTimeout(() => {
                        channel.delete();
                    }, 5000);
                } else {
                    function codegen(length) {
                        let result = "";
                        let characters = "23456789";
                        let charactersLength = characters.length;
                        for (let i = 0; i < length; i++) {
                            result += characters.charAt(
                                Math.floor(Math.random() * charactersLength),
                            );
                        }
                        return result;
                    }

                    const code = codegen(10);

                    const emailmessage = {
                        from: config.Email.From,
                        to: messagecollected.content,
                        subject: "DinoHost - Łączenie konta z Discordem",
                        html:
                            "Witaj! " +
                            message.author.username +
                            " (ID: " +
                            message.author.id +
                            ") próbował połączyć swoje konto Discord z tym adresem e-mail w panelu. Oto kod weryfikacyjny, który jest potrzebny do połączenia: " +
                            code,
                    };
                    transport.sendMail(emailmessage, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            channel.send(
                                "Sprawdź skrzynkę email, aby uzyskać kod weryfikacyjny potrzebny do połączenia Twojego konta. Masz 2 minuty",
                            );

                            const collector = new Discord.MessageCollector(
                                channel,
                                (m) => m.author.id === message.author.id,
                                {
                                    time: 120000,
                                    max: 2,
                                },
                            );
                            collector.on("collect", (message) => {
                                if (message.content === code) {
                                    const timestamp = `${moment().format("HH:mm:ss")}`;
                                    const datestamp = `${moment().format("DD-MM-YYYY")}`;
                                    userData.set(`${message.author.id}`, {
                                        discordID: message.author.id,
                                        consoleID: consoleUser.attributes.id,
                                        email: consoleUser.attributes.email,
                                        username: consoleUser.attributes.username,
                                        linkTime: timestamp,
                                        linkDate: datestamp,
                                        domains: [],
                                    });

                                    let embedstaff = new Discord.MessageEmbed()
                                        .setColor("Green")
                                        .addField(
                                            "__**Nick z Discorda:**__",
                                            message.author.id,
                                        )
                                        .addField(
                                            "__**Adres email:**__",
                                            consoleUser.attributes.email,
                                        )
                                        .addField(
                                            "__**Czas:**__",
                                            timestamp + " / " + datestamp,
                                        )
                                        .addField(
                                            "__**Nick z panelu:**__",
                                            consoleUser.attributes.username,
                                        )
                                        .addField(
                                            "__**ID użytkownika w panelu:**__",
                                            consoleUser.attributes.id,
                                        );

                                    channel.send("Konto połączone!").then(
                                        client.channels.cache
                                            .get(MiscConfigs.accountLinked)
                                            .send(
                                                `<@${message.author.id}> połączył swoje konto. Oto kilka informacji: `,
                                                embedstaff,
                                            ),
                                        setTimeout(() => {
                                            channel.delete();
                                        }, 5 * 1000),
                                    );
                                } else {
                                    channel.send(
                                        "Kod jest niepoprawny! Anulowano łączenie.\n\nUsuwam kanał...",
                                    );
                                    setTimeout(() => {
                                        channel.delete();
                                    }, 2000);
                                }
                            });
                        }
                    });
                }
            }, 10 * 1000);
        });
    } else {
        let embed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .addField(`__**Nazwa użytkownika**__`, userData.fetch(message.author.id + ".username"))
            .addField(
                `__**Data (YYYY-MM-DD)**__`,
                userData.fetch(message.author.id + ".linkDate"),
            )
            .addField(`__**Czas**__`, userData.fetch(message.author.id + ".linkTime"));
        await message.reply("Te konto jest już połączone!", embed);
    }
};