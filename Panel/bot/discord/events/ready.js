//let client = require("../../../../index.js").client;
const axios = require('axios');
module.exports = async (client, guild, files) => {
    console.log(chalk.magenta('[DISCORD] ') + chalk.green(client.user.username + " has logged in!"));

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

    //Reaction-Roles:
    let rChannel = client.channels.get(client.reactionRoles.channel);
    let rMessage = await rChannel.fetchMessage(client.reactionRoles.message);
    let reactionEmojis = Object.keys(client.reactionRoles.reactions);

    for (let ri in reactionEmojis) {
        let reaction = reactionEmojis[ri];
        if (reaction.length == 18) client.emojis.get(reaction);
        await rMessage.react(reaction);
    }
    // end of Reaction-Roles
    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, {
            type: activity.type
        });
    }, 30000);

    global.invites = {};
    client.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });

    //const ticketCategory = await client.guilds.get("639477525927690240").fetch('654313162086285323')
    //  console.log(ticketCategory.children.size)

    setInterval(async () => {
        let guild1 = await client.guilds.get("639477525927690240").fetchMembers();
        let roleID1 = '748117822370086932';
        let staffCount = guild1.roles.get(roleID1).members.size;
        client.channels.get("739821419910791348").edit({
            name: `Staff: ${staffCount}`,
            reason: "Staff count update"
        });

        let guild2 = await client.guilds.get("639477525927690240").fetchMembers();
        let roleID2 = '639490038434103306';
        let memberCount = guild2.roles.get(roleID2).members.size;
        client.channels.get("739821366991257621").edit({
            name: `Members: ${memberCount}`,
            reason: "Member count update"
        });

        let guild3 = await client.guilds.get("639477525927690240").fetchMembers();
        let roleID3 = '704467807122882562';
        let botCount = guild3.roles.get(roleID3).members.size;
        client.channels.get("739821468296413254").edit({
            name: `Bots: ${botCount}`,
            reason: "Bot count update"
        });

        let guild4 = await client.guilds.get("639477525927690240")
        const ticketcount = guild4.channels.filter(x => x.name.endsWith("-ticket")).size
        client.channels.get("739821447924416562").edit({
            name: `Tickets: ${ticketcount}`,
            reaon: "Ticket count update"
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
                reaon: "Server count update"
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
                reaon: "Client count update"
            })
        });
    }, 30000);
};