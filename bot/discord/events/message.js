const cap = require("../util/cap");

module.exports = async (client, message) => {
    // Ban members which ping 20+ users
    if (message.mentions.users.size >= 20) {
        message.member.ban({ reason: "Suspected raid. Pinging more than 20 users." });
        message.reply(`${message.member.toString()} has been banned for pinging more than 20 users`);

        const embed = new Discord.MessageEmbed()
            .setTitle("User banned for pinging more than 20 users")
            .addField("User", "Banned " + message.member.toString(), true)
            .setColor(0xff7700)
            .setTimestamp(new Date());

        client.channels.cache.get(config.DiscordBot.oLogs).send(embed);
    };

    // Suggestions channels reactions
    const suggestionChannels = [
        "980595293768802327", // Staff Suggestions
        "976371313901965373" // VPN Suggestions
    ];

    const publishedChannels = [
        "898327108898684938" // Server Status
    ];

    if (suggestionChannels.some(channel => channel == message.channel.id)) {
        if (!message.content.startsWith(">")) {
            message.react("👍");

            setTimeout(() => {
                message.react("👎");
            }, 200);
        }
    }

    if(publishedChannels.some(channel => channel == message.channel.id)) {
        try {
            message.crosspost();
        } catch(Error) {
            console.log("Error crossposting message:", Error);
        }
    }

    // Handles direct messages
    const dmAllowedUsers = [
        "137624084572798976", // Dan
        "853158265466257448", // William
        "757296951925538856", // DIBSTER
        "459025800633647116"  // AVIXITY
    ];

    if (message.channel.type === "dm") {
        // Allow users to send messages on behalf of the bot if they are allowed
        if (dmAllowedUsers.some(member => member == message.author.id)) {
            const args = message.content.trim().split(/ +/g);

            try {
                await client.channels.cache.get(args[0]).send(cap(message.content.split(" ").slice(1).join(" "), 2048));
                // message.react("<:Yes:768256004655677451>");
                message.channel.send(`<:Yes:768256004655677451> Message sent to <#${args[0]}>`);
            } catch(err) {
                message.channel.send(`<:No:768256005426511912> An error occurred\n\`\`\`${err.message}\`\`\``);
            }
        };
    };

    if (message.author.bot) return; // Stop bots from running commands
    if (message.channel.type === "dm") return; // Stop commands in DMs

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
            "898041849783148585", // lounge
            "898041854262648842", // thank-you-dan
            "928029676209852517", // egg-bugs
            "898041857550995506", // memes
            "898041859681701948", // movie-night
            "898041861040664576", // setups
            "898041851729305621", // spam
            "898041858666668092", // pets
            "898041865616650240", // dono-lounge
            "898041892279836692", // hosting
            "898041894746066985", // python
            "898041895987585024", // javascript
            "898041896956469249", // web-dev
            "938630088256286720", // vps-hosting
            "1056858054819336192", // node-bot-outages
            "1138925759264739398" // vpn
        ];

        // Channel checker
        if (
            blacklisted.includes(message.channel.id) &&
            !message.member.roles.cache.find((x) => x.id === "898041751099539497") &&
            !message.member.roles.cache.find((x) => x.id === "898041743566594049") &&
            !(message.channel.id === "898041853096628267" && command === "info")
        ) return;

        if (
            sudo.get(message.member.id) &&
            message.member.roles.cache.find((r) => r.id === "898041747597295667") &&
            args[0] != "sudo"
        ) {
            // Double check the user is allowed to use this command
            actualExecutorId = JSON.parse(JSON.stringify({ a: message.member.id })).a; // Deep clone sender user ID

            console.log(
                chalk.magenta("[DISCORD] ") + chalk.yellow(`Command being executed with sudo by ${actualExecutorId}`)
            );

            let userToCopy = sudo.get(actualExecutorId);

            // await message.guild.members.fetch(userToCopy);  // Cache user data
            // await client.users.fetch(userToCopy); // Cache user data

            message.guild.member.id = userToCopy;
            message.author.id = userToCopy;
        }

        if (
            command === "info" ||
            command === "server" ||
            command === "user" ||
            command === "staff" ||
            command === "ticket"
        ) {
            // Cooldown setting
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

    // Remove all clone traces after running command
    if (actualExecutorId) {
        message.guild.member.id = actualExecutorId;
        message.author.id = actualExecutorId;
    }
};
