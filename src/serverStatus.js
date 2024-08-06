const Discord = require('discord.js');

let nstatus = {
    "Performance Nodes": [
        {
            name: "PNode 1",
            data: "pnode1",
            maxCount: 8000,
        },
        {
            name: "PNode 2",
            data: "pnode2",
            maxCount: 8000,
        },
        {
            name: "PNode 3",
            data: "pnode3",
            maxCount: 7000,
        },
    ],

    "Donator Nodes": [
        {
            name: "Dono-01",
            data: "dono01",
            location: "UK",
            maxCount: 1700,
        },
        {
            name: "Dono-02",
            data: "dono02",
            maxCount: 600,
        },
        {
            name: "Dono-03",
            data: "dono03",
            maxCount: 3000,
        },
        {
            name: "Dono-04",
            data: "dono04",
            maxCount: 500,
        }
    ],
    "Storage Nodes": [
        {
            name: "Storage-1",
            data: "storage1",
            location: "UK",
            maxCount: 900,
        },
    ],
    "Dedicated Servers (VPS/VM Hosts)": [
        {
            name: "US 1",
            data: "vm-us-1",
        },
        {
            name: "EU 1",
            data: "vm-eu-1",
        },
    ],
    "DBH Services": [
        {
            name: "Pterodactyl (Public)",
            data: "pterodactylpublic",
        }
    ]
};

let parse = async () => {
    let toRetun = {};

    for (let [title, data] of Object.entries(nstatus)) {
        let temp = [];
        for (let d of data) {
            let da = nodeStatus.get(d.data.toLowerCase());
            let nodeData = nodeServers.get(d.data.toLowerCase());
            let ping = nodePing.fetch(d.data.toLowerCase());
            let serverUsage = d.data.toLowerCase().startsWith("node")
                ? `(${!nodeData?.servers ? "N/A" : nodeData.servers} / ${d.maxCount})`
                : "" || d.data.toLowerCase().includes("dono")
                  ? `(${!nodeData?.servers ? "N/A" : nodeData.servers} / ${d.maxCount})`
                  : "" || d.data.toLowerCase().startsWith("pnode")
                    ? `(${!nodeData?.servers ? "N/A" : nodeData.servers} / ${d.maxCount})`
                    : "";

            da = da.maintenance
                ? `🟣 Maintenance ~ Returning Soon!`
                : da.status
                  ? `🟢 Online ${serverUsage}`
                  : da.is_vm_online == null
                    ? "🔴 **Offline**"
                    : (da.is_vm_online ? "🟠 **Wings**" : "🔴 **System**") +
                      ` **offline** ${serverUsage}`;

            temp.push(`${d.name}: ${da}`);
        }

        toRetun[title] = temp;
    }
    return toRetun;
};

let getEmbed = async () => {
    let status = await parse();
    let desc = "";

    for (let [title, d] of Object.entries(status)) {
        desc = `${desc}***${title}***\n${d.join("\n")}\n\n`;
    }

    const Embed = new Discord.MessageEmbed();

    Embed.setTitle("DBH Service Status");
    Embed.setDescription(desc);
    Embed.setTimestamp();
    Embed.setColor("#7388d9");
    Embed.setFooter("Last Updated");

    return Embed;
};

module.exports = {
    parse: parse,
    getEmbed: getEmbed,
};
