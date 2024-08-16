const Discord = require("discord.js");
const { exec } = require("child_process");

const ServerStatus = require("../serverStatus.js");
const Config = require('../../config.json');
const MiscConfigs = require('../../config/misc-configs.js');

/**
 * @param {Discord.Client} client 
 */
module.exports = async (client) => {
    const guild = client.guilds.cache.get(Config.DiscordBot.MainGuildId);

    let checkNicks = () => {
        guild.members.cache
            .filter((member) => member.displayName.match(/^[a-z0-9]/i) == null)
            .forEach((x) => {
                x.setNickname("Kocham wojtoteke <3");
            });
    };

    checkNicks();

    console.log(
        chalk.magenta("[DISCORD] ") + chalk.green(client.user.username + " zalogował się!"),
    );

    // Cloes all accounts channels that are older than 30 minutes.
    guild.channels.cache
        .filter((x) => x.parentID === MiscConfigs.accounts && Date.now() - x.createdAt > 30 * 60 * 1000)
        .forEach((x) => x.delete());

    // Initializing Cooldown
    client.cooldown = {};

    // Automatic 30 second git pull.
    setInterval(() => {
        exec(`git pull`, (error, stdout) => {
            let response = error || stdout;
            if (!error) {
                if (!response.includes("Brak aktualizacji!")) {
                    client.channels.cache
                        .get(MiscConfigs.github)
                        .send(
                            `<t:${Date.now().toString().slice(0, -3)}:f> Automatyczna aktualizacja z GitHuba, pobieram pliki.\n\`\`\`${response}\`\`\``,
                        );
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                }
            }
        });
    }, 30000);

    setInterval(() => {
        // Auto Activities List
        const activities = [
            {
                text: "panel klienta",
                type: "WATCHING",
            },
            {
                text: "darmowe serwery",
                type: "WATCHING",
            },
            {
                text: "50+ zadowolonych klientów",
                type: "WATCHING",
            },
            {
                text: "Minecraft",
                type: "PLAYING",
            },
            {
                text: "potężne serwery",
                type: "WATCHING",
            },
        ];

        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, {
            type: activity.type,
        });
    }, 15000);

    await ServerStatus.startNodeChecker(); // Start the Node Checker.

    // Node Status Embed.
    const channel = client.channels.cache.get(MiscConfigs.nodestatus);

    setInterval(async () => {
        const embed = await ServerStatus.getEmbed();

        let messages = await channel.messages.fetch({
            limit: 10,
        });

        messages = messages.filter((x) => x.author.id === client.user.id).last();

        if (messages == null) channel.send(embed);
        else messages.edit(embed);
    }, 15 * 1000);
};
