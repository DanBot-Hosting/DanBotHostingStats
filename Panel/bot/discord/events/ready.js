const exec = require('child_process').exec;
const axios = require('axios');
const nstatus = require('../serverStatus');
global.snipes = new Discord.Collection();
const db = require("quick.db");

module.exports = async (client, guild, files) => {

    function getUsers() {
            client.guilds.cache.get("639477525927690240").members.fetch().then(r => {
                r.forEach(r => {
                    if(r.user.bot) {
                        if (!db.get(r.user.id)) {
                            client.guilds.cache.get("639477525927690240").members.kick(r.user.id);
                            console.log('Kicked ' + r.user.username + " ID: " + r.user.id)
                        }

                    }
                });
            });
    }

    setInterval(() => {
        client.guilds.cache.get("639477525927690240").members.fetch().then(r => {
            r.forEach(r => {
                let userid = r.displayName
                //console.log(userid)
                if (['!', '`', '#', "'", '-', '.', '_', '"', '+', '*', '£', "$", '%', '^', "&", '(', ')'].some(r => userid.startsWith(r)))return r.setNickname('⚠️HOISTER ALERT ⚠️')

            })
        })
    }, 60000) //1mins

    console.log(chalk.magenta('[DISCORD] ') + chalk.green(client.user.username + " has logged in!"));
    //getUsers()

    //Check make sure create account channels are closed after a hour
    setTimeout(() => {
        client.guilds.cache.get("639477525927690240").channels.cache.filter(x => x.parentID === '738539016688894024' && (Date.now() - x.createdAt) > 1800000).forEach(x => x.delete())
    }, 60000)

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
                };
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


};