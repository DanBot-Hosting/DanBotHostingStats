const cap = require("../util/cap");

module.exports = async (client, message) => {
    // Suggestions channels reactions
    const suggestionChannels = [
        "980595293768802327", // Staff Suggestions
        "976371313901965373" // VPN Suggestions
    ];

    if (suggestionChannels.some(channel => channel == message.channel.id)) {
        if (!message.content.startsWith(">")) {
            await message.react("👍");
            await message.react("👎");
        }
    }

    // Handles direct messages
    const dmAllowedUsers = [
        "137624084572798976", // Dan
        "853158265466257448", // William
        "757296951925538856" // DIBSTER
    ];

    if (message.channel.type === "dm") {
        // Allow users to send messages on behalf of the bot if they are allowed
        if (dmAllowedUsers.includes(message.author.id)) {
            const args = message.content.trim().split(/ +/g);

            try {
                const msg = await client.channels.cache.get(args[0]).send(cap(message.content.split(" ").slice(1).join(" "), 2000));
                message.reply(msg.url);
            } catch(err) {
                message.channel.send(`\`\`\`${err.message}\`\`\``);
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
            "898041861040664576", // setups
            "898041858666668092", // pets
            "898041851729305621", // spam
            "898041859681701948", // movie-night
            "898041865616650240", // dono-lounge
            "898041875192234054", // vps-chat
            "898354771927400538", // beta-lounge
            "976371313901965373", // vpn-suggestions
            "964215219968696390", // vpn-bugs
            "898041892279836692", // hosting
            "898041894746066985", // python
            "898041895987585024", // javascript
            "898041896956469249", // web-dev
            "898041898835509328", // java
            "1056858054819336192", // node-bot-outages
            "1192648696517640252", // bot-api
            "1138925759264739398", // vpn
            "938630088256286720", // vps-hosting
            "945031368675582023" // dans-birthday
        ];

        // Channel checker
        if (
            blacklisted.includes(message.channel.id) &&
            !message.member.roles.cache.find((x) => x.id === "898041751099539497") &&
            !message.member.roles.cache.find((x) => x.id === "898041743566594049")
        ) return;

        if (
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
};
