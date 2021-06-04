let nstatus = {
    "Nodes": [{
        name: 'Node 1',
        data: 'Node1'
    }, {
        name: 'Node 4',
        data: 'Node4'
    }, {
        name: 'Node 5',
        data: 'Node5'
    }, {
        name: 'Node 6',
        data: 'Node6'
    }, {
        name: 'Node 8',
        data: 'Node8'
    }, {
        name: 'Node 9',
        data: 'Node9'
    }, {
        name: 'Node 10',
        data: 'Node10'
    }, {
        name: 'Node 11',
        data: 'Node11'
    }, {
        name: 'Node 12',
        data: 'Node12'
    }, {
        name: 'Node 13',
        data: 'Node13'
    }, {
        name: 'Node 14',
        data: 'Node14'
    }, {
        name: 'Node 16',
        data: 'Node16'
    }, {
        name: 'Node 17',
        data: 'Node17'
    }, {
        name: 'Node 18',
        data: 'Node18'
    }, {
        name: 'Node 19 (NOT RELEASED)',
        data: 'Node19'
    }, {
        name: 'Node 20 (NOT RELEASED)',
        data: 'Node20'
    }],

    "Donator Nodes": [{
        name: 'Node 7',
        data: 'node7'
    }, {
        name: 'Node 15',
        data: 'node15'
    }],

    "Panel": [{
        name: 'US Panel 1',
        data: 'panelus1'
    }, {
        name: 'MySQL Database',
        data: 'dbhdb'
    }],

    "VPS Hosting Servers": [{
        name: 'Server 1',
        data: 'vps-server-01'
    }],

    "Dan's Panel": [{
        name: 'Panel',
        data: 'private.danbot.host'
    }, {
        name: 'Node-1',
        data: 'dan-node1'
    }],

    "LavaLink": [{
        name: 'Lava 2',
        data: 'lava2.danbot.host'
    }],

    "Misc": [{
        name: 'Mail Server',
        data: 'mail.danbot.host'
    }, {
        name: 'Reverse Proxy',
        data: '164.132.74.251'
    }, {
        name: 'Animal API',
        data: 'api.danbot.host'
    }, {
        name: 'MySQL Databases',
        data: 'mysqldatabases'
    }
    ]
}

let parse = async () => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let da = nodeStatus.get(d.data.toLowerCase());
            let nodeData = nodeServers.get(d.data.toLowerCase());
            let serverUsage = d.data.toLowerCase().includes('node') ? `(${(nodeData == null || nodeData.servers == null) ? 'N/A' : nodeData.servers} / 600)` : ''

            da = (da.status === true ? (`🟢 Online ${serverUsage}`) : ((da.is_vm_online == null ? "🔴 **Offline**" : ((da.is_vm_online === true ? "🟠 Wings" : "🔴 **System**") + ` Outage ${serverUsage}`))))

            temp.push(`**${d.name}:** ${da}`)
        }

        toRetun[title] = temp;
    }
    return toRetun;
}

let getEmbed = async () => {

    let status = await parse();
    let desc = ''

    for (let [title, d] of Object.entries(status)) {
        desc = `${desc}**__${title}:__**\n${d.join('\n')}\n\n`
    }

    date = new Date();
    var hr;
    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (date.getHours() < 10) {
        hr = `0${date.getHours()}`;
    } else {
        hr = date.getHours();
    }

    var dateString = "Updated at " + hr + ":" + ("00" + date.getMinutes()).slice(-2) + " (GMT) on "
        + date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();

    let embed = new Discord.MessageEmbed()
        .setTitle('Danbot Hosting Status').setFooter(dateString)
        .setDescription(desc);
    return embed;
}

module.exports = {
    parse: parse,
    getEmbed: getEmbed
}
