const Discord = require("discord.js");
const Config = require('../../../config.json');

exports.description = "Wyświetla informacje o typie serwera. Sprawdź tę komendę, aby uzyskać więcej informacji.";

/**
 * Komenda dokumentacji serwera. Umożliwia użytkownikom uzyskanie informacji na temat konkretnego typu serwera.
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    const helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`Lista serwerów:\n`)
        //.addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
        .addField("__**Języki programowania:**__", "NodeJS \nBun \nPython \nJava \naio \nrustc", true)
        .addField("__**Boty:**__", "redbot", true)
        //.addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
        .addField("__**Serwery głosowe:**__", "TS3 \nMumble", true)
        //.addField("__**SteamCMD:**__", "Rust \nDaystodie \nAssettocorsa \nAvorion \nBarotrauma", true)
        .addField("__**Bazy danych:**__", "MongoDB \nRedis \nPostgres14 \nPostgres16 \nMariaDB", true)
        .addField("__**Hosting WWW:**__", "Nginx", true)
        .addField("__**Eggi niestandardowe:**__", "ShareX", true)
        .addField("__**Oprogramowanie:**__", "codeserver \ngitea \nhaste \nuptimekuma", true)
        .setFooter("Przykład: " + Config.DiscordBot.Prefix + "server docs NodeJS");

    if (!args[1]) {
        await message.reply(helpEmbed);
        return;
    }

    if (args[1] == "list") {
        await message.reply(helpEmbed);
        return;
    }

    const embed = new Discord.MessageEmbed();
    switch (args[1].toLowerCase()) {
        case "aio":
            embed.setDescription(
                "`All In One`, w skrócie `aio`, obejmuje Javę, Pythona, NodeJS i inne. Użytkownik może zarządzać swoim serwerem za pomocą terminala (bash). Menedżer pakietów, taki jak apt, nie może być używany do instalacji programów (npm, pip itp. nadal działa).\nZalecane dla początkujących, ponieważ jest łatwe w użyciu.\n**Nie używaj aio do hostowania serwerów gier. Jest to zabronione i twój serwer zostanie usunięty.**",
            );
            break;
        case "nodejs":
            embed.setDescription(
                "`Node.js` to otwarte źródło, wieloplatformowe środowisko uruchomieniowe JavaScript, które działa na silniku V8 i wykonuje kod JavaScript poza przeglądarką internetową. Node.js pozwala deweloperom używać JavaScript do pisania narzędzi wiersza poleceń i do skryptów po stronie serwera — uruchamianie skryptów po stronie serwera w celu generowania dynamicznej treści stron internetowych przed wysłaniem strony do przeglądarki internetowej użytkownika. [Źródło: Wikipedia](https://en.wikipedia.org/wiki/Node.js)" +
                "\n**Jeśli jesteś początkującym, łatwiej jest używać aio!**",
            );
            break;
        case "redbot":
        case "rdb":
            embed.setDescription(
                "RedDiscordBot to otwarty bot Discorda napisany w Pythonie. Wiele komend i funkcji można dodać za pomocą Discorda." +
                "\nInstalacja jest łatwa i NIE musisz znać kodowania! Oprócz instalacji i aktualizacji, każda część bota może być kontrolowana z poziomu Discorda. [Źródło: RedDiscordBot Github](https://github.com/Cog-Creators/Red-DiscordBot)",
            );
            break;
        case "codeserver":
            embed.setDescription(
                "`codeserver` to darmowe i otwarte IDE działające w przeglądarce internetowej.",
            );
            break;
        case "gitea":
            embed.setDescription(
                "Gitea to oprogramowanie typu forge o otwartym kodzie źródłowym do hostowania rozwoju oprogramowania za pomocą Git oraz innych funkcji współpracy, takich jak śledzenie błędów, wikis i przegląd kodu. Obsługuje samodzielne hostowanie, ale także zapewnia darmową publiczną instancję. Jest to fork Gogs i jest napisane w Go. [Źródło: Wikipedia](https://en.wikipedia.org/wiki/Gitea)",
            );
            break;
        case "sharex":
            embed.setDescription("ShareX to serwer do udostępniania obrazów z integracją Discorda.");
            break;
        case "haste":
            embed.setDescription(
                "Haste to otwarte oprogramowanie pastebin napisane w node.js, które jest łatwe do zainstalowania w każdej sieci. Może być wspierane przez redis lub system plików i ma bardzo łatwy interfejs adaptera dla innych magazynów. Publicznie dostępna wersja znajduje się na hastebin.com. [Źródło: Hastebin Github](https://github.com/toptal/haste)",
            );
            break;
        case "ts3":
        case "mumble":
            embed.setDescription(
                "TeamSpeak3 i Mumble to serwery głosowe do komunikacji z przyjaciółmi.",
            );
            break;
        case "mongodb":
        case "redis":
        case "postgres":
        case "postgres14":
        case "postgres16":
        case "mariadb":
            embed.setDescription(
                "MongoDB, Redis i PostgreSQL to bazy danych. Użyj ich do przechowywania danych.\nDla MySQL możesz tworzyć bazy danych na zakładce Bazy danych w panelu.",
            );
            break;
        case "nginx":
            embed.setDescription(
                "nginx to serwer WWW. Użyj Nginx do hostowania stron PHP i HTML. Narzędzia takie jak composer dla PHP nie są dostępne.",
            );
            break;
        case "java":
            embed.setDescription(
                "Może być używane do hostowania botów w Javie.\n**Nie używaj Javy do hostowania serwerów gier. Jest to zabronione i twój serwer zostanie usunięty.**",
            );
            break;
        case "python":
            embed.setDescription(
                "Python to język programowania, który pozwala szybko pracować i skutecznie integrować systemy. [Źródło: python.org](https://www.python.org/)",
            );
            break;
        case "uptimekuma":
            embed.setDescription(
                "`Uptime Kuma` to łatwe w użyciu, samodzielnie hostowane narzędzie do monitorowania. [Źródło: Uptime Kuma](https://github.com/louislam/uptime-kuma)",
            );
            break;
        case "rustc":
            embed.setDescription(
                "Rust to potężny i nowoczesny język programowania zaprojektowany w celu zapewnienia wysokiej wydajności i bezpieczeństwa. [rust-lang.org](https://www.rust-lang.org/)",
            );
            break;
        case "grafana":
            embed.setDescription(
                "Grafana to platforma o otwartym kodzie źródłowym do monitorowania i obserwowalności, umożliwiająca użytkownikom wizualizację i analizę danych w czasie rzeczywistym z różnych źródeł za pomocą dostosowywalnych pulpitów nawigacyjnych i wykresów.",
            );
            break;
        default:
            return message.reply(
                helpEmbed.setDescription("**Ten typ serwera nie istnieje. Oto lista.**"),
            );
    }
    return message.reply(embed);
};