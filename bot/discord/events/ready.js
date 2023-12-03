const cap = require("../util/cap");
const { exec } = require("child_process");
const nstatus = require("../serverStatus");

module.exports = async (client) => {
    let guild = client.guilds.cache.get("639477525927690240");

    let checkNicks = () => {
        guild.members.cache
            .filter((member) => member.displayName.match(/^[a-z0-9]/i) == null)
            .forEach((x) => {
                x.setNickname("I love Dan <3");
            });
    };

    checkNicks();

    console.log(chalk.magenta("[DISCORD] ") + chalk.green(client.user.username + " has logged in!"));

    // Close create account channels after a hour
    guild.channels.cache
        .filter((x) => x.parentID === "898041816367128616" && Date.now() - x.createdAt > 1800000)
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
                        .get("898041843902742548")
                        .send(`<t:${Date.now().toString().slice(0, -3)}:f> Automatic update from GitHub, pulling files.\n\`\`\`${cap(response, 1900)}\`\`\``);
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                }
            }
        });
    }, 30000);

    setInterval(() => {
        //Auto Activities List
        const activities = [
            {
                text: "over DBH",
                type: "WATCHING"
            },
            {
                text: "free servers being created",
                type: "WATCHING"
            },
            {
                text: "over 15,000+ happy clients",
                type: "WATCHING"
            },
            {
                text: "with the ban hammer over abusers",
                type: "PLAYING"
            },
            {
                text: "powerful servers doing work",
                type: "WATCHING"
            }
        ];

        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, {
            type: activity.type,
        });
    }, 15000);

    // Node status embed
    if (enabled.NodeStats) {
        let channel = client.channels.cache.get("898041845878247487");
        setInterval(async () => {
            let embed = await nstatus.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10,
            });

            messages = messages.filter((x) => x.author.id === client.user.id).last();
            if (messages == null) channel.send(embed);
            else messages.edit(embed);
        }, 15000);
    }

    //Updating voice channels with proper counters.
    setInterval(async () => {
        let DBHGuild = client.guilds.cache.get("639477525927690240");

        axios({
            url: config.Pterodactyl.hosturl + "/api/application/servers",
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: "Bearer " + config.Pterodactyl.apikey,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        }).then((response) => {
            client.channels.cache.get("898041817503760444").edit({
                name: `Servers Hosting: ${response.data.meta.pagination.total}`,
                reason: "Server count update",
            }).catch((error) => {});
        }).catch((error) => {});

        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users",
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: "Bearer " + config.Pterodactyl.apikey,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        }).then((response) => {
            client.channels.cache.get("898041820309778462").edit({
                name: `Clients Hosting: ${response.data.meta.pagination.total}`,
                reason: "Client count update",
            }).catch((error) => {});
        }).catch((error) => {});
    }, 30000);
};
