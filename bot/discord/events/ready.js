const exec = require('child_process').exec;
const axios = require('axios');
const nstatus = require('../serverStatus');
const nUsage = require('../serverUsage');
const db = require("quick.db");
const pretty = require('prettysize');

module.exports = async (client) => {

    let guild = client.guilds.cache.get("639477525927690240");

    global.browser = await puppeteer.launch({ args: ["--no-sandbox"/*openvz*/] });
    console.log(chalk.magenta('[DISCORD] ') + chalk.green("Chromium launched"));

    let checkNicks = () => {
        guild.members.cache.filter(member => member.displayName.match(/^[a-z0-9]/i) == null).forEach(x => {
            x.setNickname('zHOISTER ALERT');
        })

        guild.members.cache.filter(member => ['hilter', 'jew', 'discord.gg', 'discordapp'].some(r => member.displayName.includes(r))).forEach(x => {
            x.setNickname('No, No name for you');
        })
    }

    checkNicks()

    console.log(chalk.magenta('[DISCORD] ') + chalk.green(client.user.username + " has logged in!"));
    //getUsers()

    //Check make sure create account channels are closed after a hour
    guild.channels.cache.filter(x => x.parentID === '738539016688894024' && (Date.now() - x.createdAt) > 1800000).forEach(x => x.delete())

    // setInterval(() => {
    //     let _codes = codes.fetchAll();
    //     client.guilds.cache.get('639477525927690240').channels.cache.get('795884677688721448').setTopic(`There's a total of ${_codes.length} active codes (${_codes.map(x => typeof x.data == 'string'? JSON.parse(x.data).balance : x.data.balance).reduce((a, b) => a + b, 0)} servers)`)
    // }, 60000);

    //Auto Activities List
    const activities = [{
        "text": "over DanBot Hosting",
        "type": "WATCHING"
    },
    {
        "text": "DanBot FM",
        "type": "LISTENING"
    }
    ];

    //Initializing Cooldown
    client.cooldown = {};

    //Automatic 30second git pull.
    setInterval(() => {
        exec(`git pull`, (error, stdout) => {
            let response = (error || stdout);
            if (!error) {
                if (response.includes("Already up to date.")) {
                    //console.log('Bot already up to date. No changes since last pull')
                } else {
                    client.channels.cache.get('766068015686483989').send('**[AUTOMATIC]** \nNew update on GitHub. Pulling. \n\nLogs: \n```' + response + "```" + "\n\n\n**Restarting bot**")
                    setTimeout(() => {
                        process.exit();
                    }, 1000)
                }
            }
        })
    }, 30000)

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, {
            type: activity.type
        });
    }, 30000);

    // Voice-Channels:

    client.pvc = new Discord.Collection();

    // end of Voice-Channels

    global.invites = {};
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });

    //Music stuffs
    global.guilds = {};

    //Node status channel embed
    if (enabled.NodeStats === true) {
        let channel = client.channels.cache.get("757949242495991918");
        setInterval(async () => {
            let embed = await nstatus.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10
            })
            messages = messages.filter(x => x.author.id === client.user.id).last();
            if (messages == null) channel.send(embed)
            else messages.edit(embed)

        }, 15000)
    }

    if (enabled.NodeStats === true) {
        let channel = client.channels.cache.get("797438893891911681");
        setInterval(async () => {
            let embed = await nUsage.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10
            })
            messages = messages.filter(x => x.author.id === client.user.id).last();
            if (messages == null) channel.send(embed)
            else messages.edit(embed)

        }, 15000)
    }

    //Voice channel stats updator
    setInterval(async () => {
        let guild1 = await client.guilds.cache.get("639477525927690240");
        let roleID1 = '748117822370086932';
        let staffCount = guild1.roles.cache.get(roleID1).members.size;
        client.channels.cache.get("739821419910791348").edit({
            name: `Staff: ${staffCount}`,
            reason: "Staff count update"
        });

        let guild2 = await client.guilds.cache.get("639477525927690240");
        let roleID2 = '639490038434103306';
        let memberCount = guild2.roles.cache.get(roleID2).members.size;
        client.channels.cache.get("739821366991257621").edit({
            name: `Members: ${memberCount}`,
            reason: "Member count update"
        });

        let guild3 = await client.guilds.cache.get("639477525927690240");
        let roleID3 = '704467807122882562';
        let botCount = guild3.roles.cache.get(roleID3).members.size;
        client.channels.cache.get("739821468296413254").edit({
            name: `Bots: ${botCount}`,
            reason: "Bot count update"
        });

        client.channels.cache.get("815242427978743848").edit({
            name: `Total Members: ${client.guilds.cache.get('639477525927690240').memberCount}`,
            reason: "TMembers count update"
        });

        let guild4 = await client.guilds.cache.get("639477525927690240")
        const ticketcount = guild4.channels.cache.filter(x => x.name.endsWith("-ticket")).size
        client.channels.cache.get("739821447924416562").edit({
            name: `Tickets: ${ticketcount}`,
            reason: "Ticket count update"
        })

        axios({
            url: config.Pterodactyl.hosturl + "/api/application/servers",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            client.channels.cache.get("757199549977722890").edit({
                name: `Servers Hosting: ${response.data.meta.pagination.total}`,
                reason: "Server count update"
            })
        });

        axios({
            url: config.Pterodactyl.hosturl + "/api/application/users",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            client.channels.cache.get("757222585015599214").edit({
                name: `Clients Hosting: ${response.data.meta.pagination.total}`,
                reason: "Client count update"
            })
        });
        client.channels.cache.get("758746579636191382").edit({
            name: `Boosts: ${client.guilds.cache.get("639477525927690240").premiumSubscriptionCount}`,
            reason: "Boosts count update"
        })
    }, 30000);


    setInterval(() => {
        axios({
            url: config.DanPterodactyl.hosturl + "/api/client/servers/019b6467/resources",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.DanPterodactyl.apikeyclient,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(resources => {
            client.channels.cache.get("817550848343015475").setTopic("Status: " + resources.data.attributes.current_state + " | CPU Usage: " + resources.data.attributes.resources.cpu_absolute + "% | RAM Usage: " + pretty(resources.data.attributes.resources.memory_bytes) + " / 8GB")
        }).catch(err => { });
    }, 5000)
};
