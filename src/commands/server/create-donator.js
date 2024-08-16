const Discord = require('discord.js');

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');
const serverCreateSettings_Prem = require("../../../createData_Prem");

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let userP = userPrem.fetch(message.author.id) || {
        used: 0,
        donated: 0,
    };

    const serverName =
        message.content.split(" ").slice(3).join(" ") ||
        "Nieprzypisany serwer (ustawienia -> nazwa serwera)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.reply(
            "O nie, wydaje się, że nie masz konta powiązanego z Twoim ID Discorda.\n" +
            "Jeśli jeszcze nie utworzyłeś konta, sprawdź `" +
            Config.DiscordBot.Prefix +
            "user new`, aby utworzyć konto\nJeśli już masz konto, połącz je używając `" +
            Config.DiscordBot.Prefix +
            "user link`",
        );
        return;
    }

    let allowed = Math.floor(userP.donated / Config.PremiumServerPrice);

    let pServerCreatesettings = serverCreateSettings_Prem.createParams(
        serverName,
        consoleID.consoleID,
    );

    if (allowed === 0) {
        message.reply(
            "Nie jesteś użytkownikiem premium. Aby uzyskać dostęp do premium, możesz kupić serwer (2 serwery/$1)",
        );
        return;
    }

    if (allowed - userP.used <= 0) {
        message.reply("Osiągnąłeś limit serwerów premium.");
        return;
    }

    //Wykonaj operacje tworzenia serwera
    if (!args[1]) {
        message.reply(
            new Discord.MessageEmbed()
                .setColor("RED")
                .addField(
                    "Minecraft",
                    "Forge\nPaper\nBedrock\nPocketmineMP\nWaterfall\nSpigot\nNukkit\nCurseforge",
                    true,
                )
                .addField("Grand Theft Auto", "alt:V\nmultitheftauto\nRage.MP\nSA-MP", true)
                .addField(
                    "Języki",
                    "NodeJS\nBun\nPython\nJava\naio\n Rust (użyj rustc do utworzenia)",
                    true,
                )
                .addField("Boty", "redbot", true)
                .addField("Source Engine", "GMod\nCS:GO\nARK:SE", true)
                .addField("Serwery głosowe", "TS3\nMumble\nLavalink", true)
                .addField(
                    "SteamCMD",
                    "Rust\nDaystodie\nAssettocorsa\nAvorion\nBarotrauma\nPalworld\nSCPSL",
                    true,
                )
                .addField(
                    "Bazy danych",
                    "MongoDB\nRedis\nPostgres14\nPostgres16\nMariaDB\nInfluxDB",
                    true,
                )
                .addField("Hosting WWW", "Nginx", true)
                .addField("Własne jaja", "ShareX \nOpenX", true)
                .addField(
                    "Oprogramowanie",
                    "codeserver\ngitea\nhaste\n uptimekuma\n grafana \nrabbitmq",
                    true,
                )
                .setFooter("Przykład: " + Config.DiscordBot.Prefix + "server create-donator aio Mój AIO Serwer"),
        );
        return;
    }

    let types = {
        storage: pServerCreatesettings.storage,
        nginx: pServerCreatesettings.nginx,
        nodejs: pServerCreatesettings.nodejs,
        python: pServerCreatesettings.python,
        aio: pServerCreatesettings.aio,
        java: pServerCreatesettings.java,
        paper: pServerCreatesettings.paper,
        forge: pServerCreatesettings.forge,
        "alt:v": pServerCreatesettings.altv,
        multitheftauto: pServerCreatesettings.multitheftauto,
        "sa-mp": pServerCreatesettings.samp,
        bedrock: pServerCreatesettings.bedrock,
        pocketminemp: pServerCreatesettings.pocketminemp,
        gmod: pServerCreatesettings.gmod,
        "cs:go": pServerCreatesettings.csgo,
        "ark:se": pServerCreatesettings.arkse,
        ts3: pServerCreatesettings.ts3,
        mumble: pServerCreatesettings.mumble,
        rust: pServerCreatesettings.rust,
        mongodb: pServerCreatesettings.mongodb,
        redis: pServerCreatesettings.redis,
        postgres14: pServerCreatesettings.postgres14,
        postgres16: pServerCreatesettings.postgres16,
        daystodie: pServerCreatesettings.daystodie,
        assettocorsa: pServerCreatesettings.assettocorsa,
        avorion: pServerCreatesettings.avorion,
        barotrauma: pServerCreatesettings.barotrauma,
        waterfall: pServerCreatesettings.waterfall,
        spigot: pServerCreatesettings.spigot,
        sharex: pServerCreatesettings.sharex,
        codeserver: pServerCreatesettings.codeserver,
        gitea: pServerCreatesettings.gitea,
        haste: pServerCreatesettings.haste,
        uptimekuma: pServerCreatesettings.uptimekuma,
        rustc: pServerCreatesettings.rustc,
        redbot: pServerCreatesettings.redbot,
        grafana: pServerCreatesettings.grafana,
        openx: pServerCreatesettings.openx,
        mariadb: pServerCreatesettings.mariadb,
        lavalink: pServerCreatesettings.lavalink,
        rabbitmq: pServerCreatesettings.rabbitmq,
        palworld: pServerCreatesettings.palworld,
        nukkit: pServerCreatesettings.nukkit,
        curseforge: pServerCreatesettings.curseforge,
        scpsl: pServerCreatesettings.scpsl,
        bun: pServerCreatesettings.bun,
        influxdb: pServerCreatesettings.influxdb,
    };

    if (Object.keys(types).includes(args[1].toLowerCase())) {
        serverCreateSettings_Prem
            .createServer(types[args[1].toLowerCase()])
            .then((response) => {
                userPrem.set(message.author.id + ".used", userP.used + 1);

                let embed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .addField(`Status`, response.statusText)
                    .addField(`ID użytkownika`, consoleID.consoleID)
                    .addField(`Nazwa serwera`, serverName)
                    .addField(`Typ`, args[1].toLowerCase())
                    .addField(
                        `__**OSTRZEŻENIE**__`,
                        `Proszę nie hostować serwerów gier na serwerach java lub AIO. Jeśli potrzebujesz serwera gry, musisz użyć Dono2. Miejsca kosztują 1$ za 2 serwery!`,
                    );
                message.reply(embed);

                const embed2 = new Discord.MessageEmbed()
                    .setTitle("Nowy serwer donatora został utworzony!")
                    .addField("Użytkownik:", message.author.id)
                    .addField(`Status`, response.statusText)
                    .addField(`ID użytkownika`, consoleID.consoleID)
                    .addField(`Nazwa serwera`, serverName)
                    .addField(`Typ`, args[1].toLowerCase())
                    .setFooter(
                        "Użytkownik ma " + (userP.used + 1) + " z maksymalnie " + allowed + " serwerów",
                    );

                client.channels.cache.get(MiscConfigs.donatorlogs).send(embed2);
            })
            .catch((error) => {
                if (error == "AxiosError: Request failed with status code 400") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Węzły donatora są obecnie pełne, sprawdź <#` + MiscConfigs.serverStatus + `> po aktualizacje.\nJeśli nie ma aktualizacji, powiadom administratora systemu (<@& ` + Config.DiscordBot.Roles.SystemAdmin + `>)`,
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 504") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Węzły donatora są obecnie offline lub mają problemy. Możesz sprawdzić status węzła na tym kanale: <#` + MiscConfigs.serverStatus + `>`,
                        );
                    message.reply(embed);
                } else if (error == "AxiosError: Request failed with status code 429") {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Ups, to nie powinno się zdarzyć, spróbuj ponownie.`,
                        );
                    message.reply(embed);
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("RED")
                        .addField(
                            `__**Nie udało się utworzyć nowego serwera**__`,
                            `Wystąpił inny problem. Jeśli to się powtarza, otwórz zgłoszenie i powiadom Smutexa\nBłąd: ${error}`,
                        );
                    message.reply(embed);
                }
            });
        return;
    } else {
        message.reply(
            new Discord.MessageEmbed()
                .setColor("RED")
                .addField(
                    "Minecraft",
                    "Forge\nPaper\nBedrock\nPocketmineMP\nWaterfall\nSpigot\nNukkit\nCurseforge",
                    true,
                )
                .addField("Grand Theft Auto", "alt:V\nmultitheftauto\nRage.MP\nSA-MP", true)
                .addField(
                    "Języki",
                    "NodeJS\nBun\nPython\nJava\naio\n Rust (użyj rustc do utworzenia)",
                    true,
                )
                .addField("Boty", "redbot", true)
                .addField("Source Engine", "GMod\nCS:GO\nARK:SE", true)
                .addField("Serwery głosowe", "TS3\nMumble", true)
                .addField("SteamCMD", "Rust\nDaystodie\nAssettocorsa\nAvorion\nBarotrauma", true)
                .addField(
                    "Bazy danych",
                    "MongoDB\nRedis\nPostgres14\nPostgres16\nMariaDB\nInfluxDB",
                    true,
                )
                .addField("Hosting WWW", "Nginx", true)
                .addField("Własne jaja", "ShareX\nOpenX", true)
                .addField("Oprogramowanie", "codeserver\ngitea\nhaste\n uptimekuma\n grafana", true)
                .setFooter("Przykład: " + Config.DiscordBot.Prefix + "server create-donator aio Mój serwer"),
        );
    }
};

exports.description = "Tworzy serwer donator.";