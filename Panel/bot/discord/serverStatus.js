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

let parse = () => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];

        for (let d of data) {
            temp.push(`**${d.name}:** ${nodeStatus.get(d.data).status}`)
        }

        toRetun[title] = temp;
    }
    return toRetun;
}

let getEmbed = () => {
    let data = parse();

    let embed = new Discord.RichEmbed();
    embed.setTitle("Danbot Hosting Status");

    for (let [title, d] of Object.entries(data)) {
        embed.setDescription(`${embed.description || ''}**__${title}:__** ${d.join('\n')}\n\n`)
    }
    return embed;
}

module.exports = {
    parse: parse,
    getEmbed: getEmbed
}