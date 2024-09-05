const Discord = require("discord.js");
const Chalk = require("chalk");
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
                x.setNickname("I love Dan <3");
            });
    };

    checkNicks();

    console.log(
        Chalk.magenta("[DISCORD] ") + Chalk.green(client.user.username + " has logged in!"),
    );

    // Cloes all accounts channels that are older than 30 minutes.
    guild.channels.cache
        .filter((x) => x.parentID === MiscConfigs.accounts && Date.now() - x.createdAt > 30 * 60 * 1000)
        .forEach((x) => x.delete());

    //Initializing Cooldown
    client.cooldown = {};

    //Automatic 30second git pull.
    setInterval(() => {
        exec(`git pull`, (error, stdout) => {
            let response = error || stdout;
            if (!error) {
                if (!response.includes("Already up to date.")) {
                    client.channels.cache
                        .get(MiscConfigs.github)
                        .send(
                            `<t:${Date.now().toString().slice(0, -3)}:f> Automatic update from GitHub, pulling files.\n\`\`\`${response}\`\`\``,
                        );
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                }
            }
        });
    }, 30000);

    setInterval(() => {
        client.user.setActivity({
            name: "over DBH",
            type: "WATCHING",
            url: "https://danbot.host"
        })
    }, 1000 * 60);

    if (Config.Enabled.nodestatsChecker == true) {

        await ServerStatus.startNodeChecker(); //Start the Node Checker.

        console.log(Chalk.magenta("[NODE CHECKER] ") + Chalk.greenBright("Enabled"));

        // Node Status Embed.
        const channel = client.channels.cache.get(MiscConfigs.nodestatus);

        setInterval(async () => {
            const embed = await ServerStatus.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10,
            });

            messages = messages.filter((x) => x.author.id === client.user.id).last();

            if (messages == null) channel.send({embeds: [embed]});
            else messages.edit({embeds: [embed]});
        }, 15 * 1000);
    } else {
        console.log(Chalk.magenta("[NODE CHECKER] ") + Chalk.redBright("Disabled"));
    }
};
