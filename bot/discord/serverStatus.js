let nstatus = {
    "Performance Nodes": [
        {
            name: "PNode 1",
            data: "pnode1",
            maxCount: 6000,
        },
        {
            name: "PNode 2",
            data: "pnode2",
            maxCount: 6000,
        },
        {
            name: "PNode 3",
            data: "pnode3",
            maxCount: 5000,
        }
    ],

    "Donator Nodes": [
        {
            name: "Dono-01",
            data: "dono01",
            location: "UK",
            maxCount: 400,
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
            maxCount: 2000,
        }
    ],
    "Storage Nodes": [
        {
            name: "Storage-1",
            data: "storage1",
            location: "UK",
            maxCount: 900,
        }
    ],
    "VPN Servers": [
        {
            name: "US 1",
            data: "us1",
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
        }
    ],
    "DBH Services": [
        {
            name: "Grafana (Monitoring)",
            data: "grafana",
        },
        {
            name: "Pterodactyl (Public)",
            data: "pterodactylpublic",
        },
        {
            name: "Pterodactyl (Core)",
            data: "pterodactylcore",
        },
        {
            name: "Proxmox",
            data: "proxmox",
        },
        {
            name: "VPN API (DEV)",
            data: "vpnapi",
        },
    ],
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

            da =
                da.maintenance
                    ? `🟣 Maintenance ~ Returning Soon!`
                    : da.status
                    ? `🟢 Online ${serverUsage}`
                    : da.is_vm_online == null
                    ? "🔴 **Offline**"
                    : (da.is_vm_online ? "🟠 **Wings**" : "🔴 **System**") + ` **offline** ${serverUsage}`;

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

    let embed = new Discord.MessageEmbed().setTitle("DBH Service Status").setDescription(desc).setTimestamp();
    return embed;
};

module.exports = {
    parse: parse,
    getEmbed: getEmbed,
};
