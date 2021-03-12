let nstatus = {
    "Public": [{
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

    "Dan's Panel": [{
        name: 'Node-1',
        data: 'dan-node1'
    }]
}

let parse = async () => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {

            let stats = ((title == "Public" && d.name.toLowerCase().includes('node') == true) ? nodeData.get(d.data) : null);


            temp.push(`**${d.name}:** ${stats != null ? `**CPU**: ${stats.cpuload}, **RAM**: ${stats.memused} / ${stats.memtotal}, **SSD**: ${stats.diskused} / ${stats.disktotal}` : ''}`)
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
