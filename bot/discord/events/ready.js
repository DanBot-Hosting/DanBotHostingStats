const exec = require('child_process').exec;
const nstatus = require('../serverStatus');

module.exports = async (client) => {

    let guild = client.guilds.cache.get("639477525927690240");

    console.log(chalk.magenta('[DISCORD] ') + chalk.green("Chromium launched"));

    let checkNicks = () => {
        guild.members.cache.filter(member => member.displayName.match(/^[a-z0-9]/i) == null).forEach(x => {
            x.setNickname('I love Dan <3');
        })
    }

    checkNicks()

    console.log(chalk.magenta('[DISCORD] ') + chalk.green(client.user.username + " has logged in!"));
    //getUsers()

    //Check make sure create account channels are closed after a hour
    guild.channels.cache.filter(x => x.parentID === '898041816367128616' && (Date.now() - x.createdAt) > 1800000).forEach(x => x.delete())

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
                    client.channels.cache.get('898041843902742548').send('**[AUTOMATIC]** \nNew update on GitHub. Pulling. \n\nLogs: \n```' + response + "```" + "\n\n\n**Restarting bot**")
                    setTimeout(() => {
                        process.exit();
                    }, 1000)
                }
            }
        })
    }, 30000);

    setInterval(() => {
        //Auto Activities List
        const activities = [{
            "text": "over DanBot Hosting",
            "type": "WATCHING"
        }, {
            "text": "free servers be created!",
            "type": "WATCHING"
        }, {
            "text": "over " + users.length + " happy clients",
            "type": "WATCHING"
        }];

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
        let channel = client.channels.cache.get("898041845878247487");
        setInterval(async () => {
            let embed = await nstatus.getEmbed();

            let messages = await channel.messages.fetch({
                limit: 10
            });

            messages = messages.filter(x => x.author.id === client.user.id).last();
            if (messages == null) channel.send(embed);
            else messages.edit(embed);

        }, 15000);
    };

    //Updating voice channels with proper counters.
    setInterval(async () => {
        let DBHGuild = client.guilds.cache.get("639477525927690240");
        let roleID1 = '898041751099539497';
        let staffCount = DBHGuild.roles.cache.get(roleID1).members.size;
        client.channels.cache.get("898041828870348800").edit({
            name: `Staff: ${staffCount}`,
            reason: "Staff count update"
        });

        let roleID2 = '898041757168697375';
        let memberCount = DBHGuild.roles.cache.get(roleID2).members.size;
        client.channels.cache.get("898041827561730069").edit({
            name: `Members: ${memberCount}`,
            reason: "Member count update"
        });

        let roleID3 = '898041770082959432';
        let botCount = DBHGuild.roles.cache.get(roleID3).members.size;
        client.channels.cache.get("898041830241882112").edit({
            name: `Bots: ${botCount}`,
            reason: "Bot count update"
        });

        client.channels.cache.get("898041826810949632").edit({
            name: `Total Members: ${DBHGuild.memberCount}`,
            reason: "TMembers count update"
        });

        const ticketcount = DBHGuild.channels.cache.filter(x => x.name.endsWith("-ticket")).size
        client.channels.cache.get("898041832569700362").edit({
            name: `Tickets: ${ticketcount}`,
            reason: "Ticket count update"
        });

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
            client.channels.cache.get("898041817503760444").edit({
                name: `Servers Hosting: ${response.data.meta.pagination.total}`,
                reason: "Server count update"
            });
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
            client.channels.cache.get("898041820309778462").edit({
                name: `Clients Hosting: ${response.data.meta.pagination.total}`,
                reason: "Client count update"
            });
        });

        client.channels.cache.get("898041831495974983").edit({
            name: `Boosts: ${DBHGuild.premiumSubscriptionCount}`,
            reason: "Boosts count update"
        });
    }, 30000);
};
