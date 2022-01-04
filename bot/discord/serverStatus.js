let nstatus = {
    "Nodes": [{
        name: 'Node 1 ',
        data: 'Node1'
    }, {
        name: 'Node 2 ',
        data: 'Node2'
    },{
        name: 'Node 3 ',
        data: 'Node3'
    }, {
        name: 'Node 4 ',
        data: 'Node4'
    }, {
        name: 'Node 8 ',
        data: 'Node8'
    }],

    "Donator Nodes": [{
        name: 'Node 15',
        data: 'node15'
    }, {
        name: 'Dono-01',
        data: 'dono01'
    }],

    "Panel": [{
        name: 'UK Panel',
        data: 'panelus1'
    }, {
        name: 'Panel Database',
        data: 'dbhdb'
    }],

    "VPS Hosting Servers": [{
        name: 'Server 1',
        data: 'vps-server-01'
    }],

    "Misc": [{
        name: 'Mail Server',
        data: 'mail.danbot.host'
    }, {
        name: 'Reverse Proxy',
        data: '164.132.74.251'
    }, {
        name: 'MySQL Databases',
        data: 'mysqldatabases'
    }]
}

let parse = async() => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let da = nodeStatus.get(d.data.toLowerCase());
            let nodeData = nodeServers.get(d.data.toLowerCase());
            let serverUsage = d.data.toLowerCase().includes('node') ? `(${(nodeData == null || nodeData.servers == null) ? 'N/A' : nodeData.servers} / 1200)` : '' || d.data.toLowerCase().includes('dono') ? `(${(nodeData == null || nodeData.servers == null) ? 'N/A' : nodeData.servers} / 600)` : '' || d.data.toLowerCase().includes('node-8') ? `(${(nodeData == null || nodeData.servers == null) ? 'N/A' : nodeData.servers} / 600)` : ''

            da = (da.status === true ? (`🟢 Online ${serverUsage}`) : ((da.is_vm_online == null ? "🔴 **Offline**" : ((da.is_vm_online === true ? "🟠 Wings" : "🔴 **System**") + ` offline ${serverUsage}`))))

            temp.push(`**${d.name}:** ${da}`)
        }

        toRetun[title] = temp;
    }
    return toRetun;
}

let getEmbed = async() => {

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
