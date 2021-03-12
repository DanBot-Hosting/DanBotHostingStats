let nstatus = {
    "Public": [{
        name: 'Panel',
        data: 'panel.danbot.host'
    }, {
        name: 'Node-1',
        data: 'Node1'
    }, {
        name: 'Node-2',
        data: 'Node2'
    }, {
        name: 'Node-3',
        data: 'Node3'
    }, {
        name: 'Node-4',
        data: 'Node4'
    }, {
        name: 'Node-5',
        data: 'Node5'
    }, {
        name: 'Node-6',
        data: 'Node6'
    }, {
        name: 'Node-8',
        data: 'Node8'
    }, {
        name: 'Node-9',
        data: 'Node9'
    }, {
        name: 'Node-10',
        data: 'Node10'
    }, {
        name: 'Node-11',
        data: 'Node11'
    }, {
        name: 'Node-12',
        data: 'Node12'
    }, {
        name: 'Node-13',
        data: 'Node13'
    }, {
        name: 'Node-14',
        data: 'Node14'
    }],

    "Donator Nodes": [{
        name: 'Node-7',
        data: 'node7'
    }],

    "Storage Nodes": [{
        name: 'Storage-1',
        data: 'storage1'
    }],

    "Panel": [{
        name: 'US Panel 1',
        data: 'panelus1'
    }, {
        name: 'MySQL Database',
        data: 'dbhdb'
    }],

    "Dan's Panel": [{
        name: 'Panel',
        data: 'private.danbot.host'
    }, {
        name: 'Node-1',
        data: 'dan-node1'
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
        data: '63.141.228.92'
    }, {
        name: 'Animal API',
        data: 'api.danbot.host'
    }]
}

let parse = async () => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let da = nodeStatus.get(d.data.toLowerCase());

            let stats = ((title == "Public" && d.name.toLowerCase().includes('node') == true) ? nodeData.get(d.data) : null);

            da = (da.status === true ? ('🟢 Online') : ((da.is_vm_online == null ? "🔴 Offline" : ((da.is_vm_online === true ? "🟠 Wings" : "🔴 VM") + ' Outage'))))


            // if(nodeStatus.get(d.data).is_vm_online != null && nodeStatus.get('node1').is_vm_online === false && nodeStatus.get('node2').is_vm_online === false && nodeStatus.get('node5').is_vm_online === false, nodeStatus.get('node7').is_vm_online === false)
            //    da = '🔴 Network Outage'

            temp.push(`**${d.name}:** ${da} ${stats != null ? `[RAM: ${stats.memused}]` : ''}`)
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
    }
    else {
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
