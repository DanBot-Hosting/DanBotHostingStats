exports.run = async (client, message, args) => {
    let helpEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`List of servers:\n`)
        //.addField("__**Minecraft:**__", "Forge \nPaper \nBedrock \nPocketmineMP \nWaterfall \nSpigot", true)
        //.addField("__**Grand Theft Auto:**__", "alt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
        .addField("__**Languages:**__", "NodeJS \nPython \nJava \naio \nrustc", true)
        .addField("__**Bots:**__", "redbot", true)
        //.addField("__**Source Engine:**__", "GMod \nCS:GO \nARK:SE", true)
        .addField("__**Voice Servers:**__", "TS3 \nMumble", true)
        //.addField("__**SteamCMD:**__", "Rust \nDaystodie \nAssettocorsa \nAvorion \nBarotrauma", true)
        .addField("__**Databases:**__", "MongoDB \nRedis \nPostgres14 \nPostgres16 \nMariaDB", true)
        .addField("__**WebHosting:**__", "Nginx", true)
        .addField("__**Custom Eggs:**__", "ShareX", true)
        .addField("__**Software:**__", "codeserver \ngitea \nhaste \nuptimekuma", true)
        .addField("__**Storage:**__", "Minio", true)
        .setFooter("Example: DBH!server docs NodeJS");

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
                "`All In One`, short `aio` includes Java, Python, NodeJS and more. The user can control his server over a terminal (bash). A package manager like apt can't be used to install programs (npm, pip, etc still works).\nRecommend for beginners, as it is easy to use.\n**Do not use aio to host gameservers. It is not allowed and your server will be deleted.**"
            );
            break;
        case "nodejs":
            embed.setDescription(
                "`Node.js` is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser. [Source: Wikipedia](https://en.wikipedia.org/wiki/Node.js)" +
                    "\n**If you are a starter, it is easier to use aio!**"
            );
            break;
        case "redbot":
        case "rdb":
            embed.setDescription(
                "RedDiscordBot is an open-source Discord Bot written in Python. Many commands and functions can be added trough Discord." +
                    "\nThe installation is easy, and you do NOT need to know anything about coding! Aside from installing and updating, every part of the bot can be controlled from within Discord. [Source: RedDiscordBot Github](https://github.com/Cog-Creators/Red-DiscordBot)"
            );
            break;
        case "codeserver":
            embed.setDescription("`codeserver` is a free and open-source IDE running in your web browser.");
            break;
        case "gitea":
            embed.setDescription(
                "Gitea is an open-source forge software package for hosting software development version control using Git as well as other collaborative features like bug tracking, wikis and code review. It supports self-hosting but also provides a free public first-party instance. It is a fork of Gogs and is written in Go. [Source: Wikipedia](https://en.wikipedia.org/wiki/Gitea)"
            );
            break;
        case "sharex":
            embed.setDescription("ShareX is an image-sharing-server with Discord Integration.");
            break;
        case "haste":
            embed.setDescription(
                "Haste is an open-source pastebin software written in node.js, which is easily installable in any network. It can be backed by either redis or filesystem, and has a very easy adapter interface for other stores. A publicly available version can be found at hastebin.com. [Source: Hastebin Github](https://github.com/toptal/haste)"
            );
            break;
        case "ts3":
        case "mumble":
            embed.setDescription("TeamSpeak3 and Mumble are voice-servers to communicate with friends.");
            break;
        case "mongodb":
        case "redis":
        case "postgres":
        case "postgres14":
        case "postgres16":
        case "mariadb":
            embed.setDescription(
                "MongoDB, Redis and PostgreSQL are Databases. Use them to store data.\nFor MySQL you can create databases under the Databases Tab in the panel."
            );
            break;
        case "nginx":
            embed.setDescription(
                "nginx is a Webserver. Use Nginx to host PHP and HTML Websites. Tools like composer for php are not available."
            );
            break;
        case "java":
            embed.setDescription(
                "Can be used to host bots in Java.\n**Do not use java to host gameservers. It is not allowed and your server will be deleted.**"
            );
            break;
        case "python":
            embed.setDescription(
                "Python is a programming language that lets you work quickly and integrate systems more effectively. [Source: python.org](https://www.python.org/)"
            );
            break;
        case "uptimekuma":
            embed.setDescription(
                "`Uptime Kuma` is an easy-to-use self-hosted monitoring tool. [Source: Uptime Kuma](https://github.com/louislam/uptime-kuma)"
            );
            break;
        case "rustc":
            embed.setDescription(
                "Rust is a powerful and modern programming language designed to deliver high performance and safety. [rust-lang.org](https://www.rust-lang.org/)"
            );
            break;
        case "grafana":
            embed.setDescription(
                "Grafana is an open-source platform for monitoring and observability, enabling users to visualize and analyze real-time data from various sources through customizable dashboards and graphs."
            );
            break;
        // case "minio":
        //     embed.setDescription(
        //         "MinIO is a cloud storage server compatible with Amazon S3, released under Apache License v2. As an object store, MinIO can store unstructured data such as photos, videos, log files, backups and container images. The maximum size of an object is 5TB."
        //     );
        //     break;
        default:
            return message.reply(helpEmbed.setDescription("**This server type does not exist. Here is a list.**"));
    }
    return message.reply(embed);
};
