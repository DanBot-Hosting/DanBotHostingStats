const humanizeDuration = require('humanize-duration');
const axios = require('axios');

let nstatus = {
    "Public Panel": [{
        name: 'Panel',
        data: 'panel.danbot.host'
    }, {
        name: 'Node-1',
        data: 'node1'
    }, {
        name: 'Node-2',
        data: 'node2'
    }, {
        name: 'Node-3',
        data: 'node3'
    }, {
        name: 'Node-4',
        data: 'node4'
    }, {
        name: 'Node-5',
        data: 'node5'
    }, {
        name: 'Node-6',
        data: 'node6'
    }],

    "Donator Nodes": [{
        name: 'Node-7',
        data: 'node7'
    }],

    "Admin Panel": [{
        name: 'Panel',
        data: 'admin.danbot.host'
    }, {
        name: 'Node-1',
        data: 'node1-priv'
    }],

    "Public Game Servers": [{
        name: 'Panel',
        data: 'pub.danbot.host'
    }, {
        name: 'Node-1',
        data: 'pub_node1'
    }],

    "Misc": [{
        name: 'Lavalink 1',
        data: 'lava.danbot.host'
    }, {
        name: 'Lavalink 2',
        data: 'lava2.danbot.host'
    }, {
        name: 'Mail Server',
        data: 'mail.danbot.host'
    }, {
        name: 'Reverse Proxy',
        data: '154.27.68.234'
    }, {
        name: 'Animal API',
        data: 'api.danbot.host'
    }]
}

let parse = async () => {
    let toRetun = {};

    let PubNodeStatus;

    await axios({
        url: 'http://localhost:3001',
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
    }).then(x => {
        PubNodeStatus = x.data;
    })

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let da = (PubNodeStatus == null || PubNodeStatus[d.data] == null) ? {
                status: nodeStatus.get(d.data).status.includes('Online')
            } : PubNodeStatus[d.data];

            da = (da.status == true ? ('🟢 Online') : ('🔴 ' + (da.vmOnline == null ? "Offline" : ((da.vmOnline == true ? "Wing" : "VM") + ' Outage' + (da.downtime_startedAt == null ? '' : ' | ' + humanizeDuration(Date.now() - da.downtime_startedAt, {
                round: true
            }))))))

            temp.push(`**${d.name}:** ${da}`)
        }

        toRetun[title] = temp;
    }
    return toRetun;
}

let getEmbed = async () => {

    let data = parse()

    let embed = new Discord.RichEmbed();
    embed.setTitle("Danbot Hosting Status");
    embed.setFooter('Updates every 15seconds');

    let desc = ''

    for await (let [title, d] of Object.entries(data)) {
        desc = `${desc}**__${title}:__**\n${d.join('\n')}\n\n`
    }

    embed.setDescription(desc)
    return embed;
}

module.exports = {
    parse: parse,
    getEmbed: getEmbed
}