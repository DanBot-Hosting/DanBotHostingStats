let nstatus = {
    "Nodes": [{
        name: 'Node 2',
        data: 'Node2',
        location: 'UK',
        maxCount: 1200
    }, {
        name: 'Node 3',
        data: 'Node3',
        location: 'UK',
        maxCount: 1200
    }, {
        name: 'Node 4',
        data: 'Node4',
        location: 'UK',
        maxCount: 1200
    }, {
        name: 'Node 5',
        data: 'Node5',
        location: 'UK',
        maxCount: 1200
    }, {
        name: 'Node 6',
        data: 'Node6',
        location: 'UK',
        maxCount: 1200
    }, {
        name: 'Node 7',
        data: 'Node7',
        location: 'UK',
        maxCount: 1200
    }, {
        name: 'Node 8',
        data: 'Node8',
        location: 'UK',
        maxCount: 600
    }],

     "Performance Nodes": [{
        name: 'PNode 1',
        data: 'pnode1',
        maxCount: 3000
    }],
    
    "Donator Nodes": [{
        name: 'Dono-01',
        data: 'dono01',
        location: 'UK',
        maxCount: 404
    }, {
        name: 'Dono-02',
        data: 'dono02',
        maxCount: 600
    }, {
        name: 'Dono-03',
        data: 'dono03',
        maxCount: 600
    }, {
        name: 'Dono-04',
        data: 'dono04',
        maxCount: 500
    }, {
        name: 'Dono-05',
        data: 'dono05',
        maxCount: 200
    }],

    "VPS Hosting Servers": [{
        name: 'France 1',
        data: 'vpsfrance-1'
    }],

    "VPN Servers": [{
        name: 'France 1',
        data: 'france1'
    }]
}

let parse = async () => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let da = nodeStatus.get(d.data.toLowerCase());
            let nodeData = nodeServers.get(d.data.toLowerCase());
            let ping = nodePing.fetch(d.data.toLowerCase())
            let serverUsage = d.data.toLowerCase().startsWith('node') ? `(${!nodeData?.servers ? 'N/A' : nodeData.servers} / ${d.maxCount}) [\`${Math.round(Number.isNaN(ping.ping) ? 0 : ping.ping)}ms\`]` : '' || d.data.toLowerCase().includes('dono') ? `(${!nodeData?.servers ? 'N/A' : nodeData.servers} / ${d.maxCount}) [\`${Math.round(Number.isNaN(ping.ping) ? 0 : ping.ping)}ms\`]` : '' || d.data.toLowerCase().startsWith('pnode') ? `(${!nodeData?.servers ? 'N/A' : nodeData.servers} / ${d.maxCount}) [\`${Math.round(Number.isNaN(ping.ping) ? 0 : ping.ping)}ms\`]` : '' 

            da = (da.maintenance === true ? (`🟣 Maintenance Mode!`) : da.status === true ? (`🟢 Online ${serverUsage}`) : ((da.is_vm_online == null ? "🔴 **Offline**" : ((da.is_vm_online === true ? "🟠 Wings" : "🔴 **System**") + ` offline ${serverUsage}`))))

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

    var dateString = "Updated at " + hr + ":" + ("00" + date.getMinutes()).slice(-2) + " (GMT) on " +
        date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();

    let embed = new Discord.MessageEmbed()
        .setTitle('DanBot Hosting Status').setFooter(dateString)
        .setDescription(desc);
    return embed;
}

module.exports = {
    parse: parse,
    getEmbed: getEmbed
}
