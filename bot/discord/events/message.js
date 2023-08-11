module.exports = async (client, message) => {
    if (message.mentions.users.size >= 20) {
        message.member.ban({ reason: "Suspected raid. Pinging more than 20 users." });
        message.reply(`${message.member.toString()} has been banned for pinging more than 20 users`);

        const embed = new Discord.MessageEmbed()
            .setTitle("User banned for pinging more than 20 users")
            .addField("User", "Banned " + message.member.toString(), true)
            .setColor(0xff7700)
            .setTimestamp(new Date());

        client.channels.cache.get(config.DiscordBot.oLogs).send(embed);
    }
    //Auto reactions on suggestions
    if (
        message.channel.id === "898041855135068221" ||
        message.channel.id === "951252958316728340" ||
        message.channel.id === "980595293768802327" ||
        message.channel.id === "976371313901965373"
    ) {
        if (!message.content.includes(">")) {
            message.react("👍");

            setTimeout(() => {
                message.react("👎");
            }, 200);
        }
    }

    if (message.channel.type === "dm") {
        if (message.author.id === "137624084572798976" || message.author.id === "853158265466257448") {
            const args = message.content.trim().split(/ +/g);
            client.channels.cache.get(args[0]).send(message.content.split(" ").slice(1).join(" "));
        } else {
            if (message.author.id === "640161047671603205") {
            } else {
                client.channels.cache
                    .get("898041919022723072")
                    .send(
                        message.author.username +
                            " (ID: " +
                            message.author.id +
                            ", PING: <@" +
                            message.author.id +
                            ">)" +
                            "\n" +
                            message.content.replace("@", "@|")
                    );
            }
        }
    }

    if (message.author.bot) return; // to stop bots from creating accounts, tickets and more.
    if (message.channel.type === "dm") return; //stops commands working in dms
    const prefix = config.DiscordBot.Prefix;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(" ").slice(1).join(" ");
    const command = args.shift().toLowerCase();
    console.log(
        chalk.magenta("[DISCORD] ") +
            chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`)
    );
    let actualExecutorId;
    try {
        let blacklisted = [
            "898041849783148585", //Lounge
            "898041854262648842", //Thank-you-dan
            "898041855135068221", //Suggestions
            "898041853096628267", //Invite-bot
            "928029676209852517", //Egg-bugs
            "951252958316728340", //Egg-suggestions
            "898041857550995506", //Memes
            "898041859681701948", //Movie-night
            "898041861040664576", //Setups
            "898041858666668092", //Pets
            "898041892279836692", //Hosting
            "898041894746066985", //Python
            "898041895987585024", //Javascript
            "898041896956469249", //HTML-and-CSS
            "898041898835509328", //Java
            "919995547358744576", //x86-assembly
            "938630088256286720", //VPS Hosting
        ];
        //Channel checker

        if (
            (blacklisted.includes(message.channel.id) ||
                (message.channel.id == "754441222424363088" && command != "snipe")) &&
            message.member.roles.cache.find((x) => x.id === "898041751099539497") == null &&
            message.member.roles.cache.find((x) => x.id === "898041743566594049") == null &&
            !(message.channel.id === "898041853096628267" && command === "info")
        )
            return;

        if (
            sudo.get(message.member.id) &&
            message.member.roles.cache.find((r) => r.id === "898041747597295667") &&
            args[0] != "sudo"
        ) {
            //Doubble check the user is deffinaly allowd to use this command
            actualExecutorId = JSON.parse(JSON.stringify({ a: message.member.id })).a; // Deep clone actual sender user ID

            console.log(
                chalk.magenta("[DISCORD] ") + chalk.yellow(`Command being executed with sudo by ${actualExecutorId}`)
            );
            let userToCopy = sudo.get(actualExecutorId);

            // await message.guild.members.fetch(userToCopy);  //Cache user data
            // await client.users.fetch(userToCopy); //Cache user data

            message.guild.member.id = userToCopy;
            message.author.id = userToCopy;
        }

        if (
            command === "server" ||
            command === "user" ||
            command === "staff" ||
            command === "dan" ||
            command === "ticket"
        ) {
            //Cooldown setting
            if (!args[0]) {
                let commandFile = require(`../commands/${command}/help.js`);
                await commandFile.run(client, message, args);
            } else {
                let commandFile = require(`../commands/${command}/${args[0]}.js`);
                await commandFile.run(client, message, args);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            await commandFile.run(client, message, args);
        }
    } catch (Error) {
        if (!Error.message.startsWith("Cannot find module")) {
            console.log("Error loading module:", Error);
        }
    }

    //After command remove all clone traces
    if (actualExecutorId) {
        message.guild.member.id = actualExecutorId;
        message.author.id = actualExecutorId;
    }
};
