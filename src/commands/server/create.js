const Discord = require('discord.js');

const Config = require('../../../config.json');
const serverCreateSettings = require("../../../createData");

exports.description = "Utwórz darmowy serwer. Zobacz tę komendę, aby uzyskać instrukcje.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Komunikat o wyłączeniu tworzenia serwera
    return message.channel.send("Tworzenie serwera jest wyłączone. Nie pinguj personelu.");

    const helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(
            `Lista serwerów: (użyj ` + Config.DiscordBot.Prefix + `server create <typ> <nazwa>)\n\n*Proszę pamiętać, że niektóre węzły mogą mieć problemy z połączeniem z botem, co może prowadzić do błędów w tym procesie.*\n`,
        )
        .addField(
            "__**Języki:**__",
            "NodeJS \nBun \nPython \nJava \naio\n Rust (użyj rustc do utworzenia)",
            true,
        )
        .addField("__**Boty:**__", "redbot", true)
        .addField("__**Serwery głosowe:**__", "TS3 \nMumble", true)
        .addField("__**Bazy danych:**__", "MongoDB \nRedis \nPostgres14 \nPostgres16 \nMariaDB", true)
        .addField("__**Hosting WWW:**__", "Nginx", true)
        .addField("__**Własne jaja:**__", "ShareX \nOpenX", true)
        .addField(
            "__**Oprogramowanie:**__",
            "codeserver \ngitea \nhaste\n uptimekuma\n grafana \n rabbitmq",
            true,
        )
        .addField("__**Przechowywanie:**__", "storage", true)
        .setFooter("Przykład: " + Config.DiscordBot.Prefix + "server create NodeJS Testing Server");

    const serverName =
        message.content.split(" ").slice(3).join(" ") ||
        "Nieprzypisany serwer (ustawienia -> nazwa serwera)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "O nie, wydaje się, że nie masz konta powiązanego z Twoim ID Discorda.\n" +
            "Jeśli jeszcze nie utworzyłeś konta, sprawdź `" +
            Config.DiscordBot.Prefix +
            "user new`, aby utworzyć konto.\nJeśli już masz konto, połącz je używając `" +
            Config.DiscordBot.Prefix +
            "user link`",
        );
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[1]) {
        await message.reply(helpEmbed);
        return;
    }

    if (args[1] == "list") {
        await message.reply(helpEmbed);
        return;
    }

    let types = {
        storage: data.storage,
        nginx: data.nginx,
        nodejs: data.nodejs,
        python: data.python,
        aio: data.aio,
        java: data.java,
        ts3: data.ts3,
        mumble: data.mumble,
        mongodb: data.mongodb,
        redis: data.redis,
        postgres14: data.postgres14,
        postgres16: data.postgres16,
        sharex: data.sharex,
        codeserver: data.codeserver,
        gitea: data.gitea,
        haste: data.haste,
        uptimekuma: data.uptimekuma,
        rustc: data.rustc,
        redbot: data.redbot,
        grafana: data.grafana,
        openx: data.openx,
        mariadb: data.mariadb,
        rabbitmq: data.rabbitmq,
        bun: data.bun,
        storage: data.storage,
    };

    if (!Object.keys(types).includes(args[1].toLowerCase())) {
        return message.reply(helpEmbed);
    }

    function createServerAndSendResponse(type, message) {
        serverCreateSettings
            .createServer(types[type])
            .then((response) => {
                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Status:**__`, response.statusText)
                    .addField(`__**Utworzono dla ID użytkownika:**__`, consoleID.consoleID)
                    .addField(`__**Nazwa serwera:**__`, serverName)
                    .addField(`__**Typ:**__`, type);

                if (type === "aio" || type === "java") {
                    embed.addField(
                        `__**OSTRZEŻENIE**__`,
                        `Proszę nie hostować serwerów gier na serwerach java lub AIO. Jeśli potrzebujesz serwera gry, użyj węzła gry. Miejsca kosztują 1$ za` + (1 / Config.PremiumServerPrice) + ` serwery!`,
                    );
                }

                message.reply(embed);
            })
            .catch((error) => {
                if (error == "AxiosError: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Węzeł jest obecnie pełny, sprawdź ` + MiscConfigs.serverStatus + ` po aktualizacje. \nJeśli nie ma aktualizacji, powiadom administratora systemu (<@& ` + Config.DiscordBot.Roles.SystemAdmin + `>)`,
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Węzeł jest obecnie offline lub ma problemy. Możesz sprawdzić status węzła na tym kanale: <#` + MiscConfigs.serverStatus + `>`,
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Ups, coś poszło nie tak, spróbuj ponownie za minutę lub dwie.`,
                        );
                    message.reply(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Wystąpił inny problem. Jeśli to się powtarza, otwórz zgłoszenie i powiadom Smutexa.\nBłąd: ${error}`,
                        );
                    message.reply(embed);
                }
            });
    }

    const type = args[1].toLowerCase();
    createServerAndSendResponse(type, message);
};