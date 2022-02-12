let nstatus = {
    "Nodes": [{
        name: 'Node 1',
        data: 'Node1'
    }, {
        name: 'Node 2',
        data: 'Node2'
    }, {
        name: 'Node 3',
        data: 'Node3'
    }, {
        name: 'Node 4',
        data: 'Node4'
    }, {
        name: 'Node 5',
        data: 'Node5'
    },
    {
        name: 'Dono-01',
        data: 'dono01'
    },
    {
        name: 'Dono-02',
        data: 'dono02'
    },
    {
        name: 'Dono-03',
        data: 'dono03'
    }]
}

let parse = async() => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {
            let stats = ((title == "Public" && d.name.toLowerCase().includes('node') == true) ? nodeData.get(d.data) : null);

            if(stats == null) {
               temp.push(`**${d.name}:** No Stats available at the moment.`)
            } else {
               temp.push(`**${d.name}:** ${stats != null ? `**CPU**: ${stats.cpuload}, **RAM**: ${stats.memused} / ${stats.memtotal}, **SSD**: ${stats.diskused} / ${stats.disktotal}` : ''}`)
            } 
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
        .setTitle('Danbot Hosting Status')
        .setDescription(desc)
        .setFooter(dateString);
    return embed;
}

module.exports = {
    nodes: nstatus,
    parse: parse,
    getEmbed: getEmbed
}
