const axios = require('axios');
module.exports = async (client, guild, files) => {
    console.log(chalk.magenta('[DISCORD] ') + chalk.green(client.user.username + " has logged in!"));

    let guild = bot.guilds.get('639477525927690240');

    //Auto Activities List
    const activities = [{
            "text": "over DanBot Hosting",
            "type": "WATCHING"
        },
        {
            "text": "DanBot FM",
            "type": "LISTENING"
        },
        {
            "text": "Stalking Dan coding me :)",
            "type": "WATCHING"
        }
    ];
    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, {
            type: activity.type
        });
    }, 30000);

    //Reaction-Roles:

    let reactionRoles = require('../reactionRoles');
    client.reactionRoles = reactionRoles;

    // end of Reaction-Roles

    global.invites = {};
    client.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });

    //Voice channel stats
    setInterval(async () => {
        let staffCount = await guild.roles.get('748117822370086932').members;
        client.channels.get("739821419910791348").edit({
            name: `Staff: ${staffCount.size}`,
            reason: "Staff count update"
        });

        let memberCount = await guild.roles.get('639490038434103306').members.size;
        client.channels.get("739821366991257621").edit({
            name: `Members: ${memberCount.size}`,
            reason: "Member count update"
        });

        let botCount = await guild3.roles.get('704467807122882562').members;
        client.channels.get("739821468296413254").edit({
            name: `Bots: ${botCount.size}`,
            reason: "Bot count update"
        });

        const ticketcount = await guild.channels.filter(x => x.name.endsWith("-ticket"))
        client.channels.get("739821447924416562").edit({
            name: `Tickets: ${ticketcount.size}`,
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
            client.channels.get("757199549977722890").edit({
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
            client.channels.get("757222585015599214").edit({
                name: `Clients Hosting: ${response.data.meta.pagination.total}`,
                reason: "Client count update"
            })
        });
        client.channels.get("758746579636191382").edit({
            name: `Boosts: ${client.guilds.get("639477525927690240").premiumSubscriptionCount}`,
            reason: "Boosts count update"
        })
    }, 30000);
};