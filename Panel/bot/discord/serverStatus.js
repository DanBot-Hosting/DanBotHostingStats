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
        data: '154.27.68.95'
    }, {
        name: 'Animal API',
        data: 'api.danbot.host'
    }]
}

let parse = async () => {
    let toRetun = {};

    let PubNodeStatus;

    // await axios({
    //     url: 'http://localhost:3001',
    //     method: 'GET',
    //     followRedirect: true,
    //     maxRedirects: 5,
    // }).then(x => {
    //     PubNodeStatus = x.data;
    // }).catch(err => {
    //     PubNodeStatus = null;
    // })

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let da = nodeStatus.get(d.data);

            da = (da.status == true ? ('🟢 Online') : ('🔴 ' + (da.is_vm_online == null ? "Offline" : ((da.is_vm_online == true ? "Wing" : "VM") + ' Outage'))))


            if(nodeStatus.get(d.data).is_vm_online != null && nodeStatus.get('node1').is_vm_online == false && nodeStatus.get('node2').is_vm_online == false && nodeStatus.get('node5').is_vm_online == false, nodeStatus.get('node7').is_vm_online == false)
                da = '🔴 Network Outage'
                
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

    let embed = new Discord.RichEmbed()
        .setTitle('Danbot Hosting Status').setFooter('This message updates every 15 seconds')
        .setDescription(desc);
    return embed;
}

module.exports = {
    parse: parse,
    getEmbed: getEmbed
}