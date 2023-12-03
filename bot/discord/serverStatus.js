let nstatus = {
    "Performance Nodes": [
        {
            name: "PNode 1",
            data: "pnode1",
            maxCount: 5000,
        },
        {
            name: "PNode 2",
            data: "pnode2",
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
        }
    ],

    "VPN Servers": [
        {
            name: "AU 1",
            data: "au1",
        },
        {
            name: "FR 1",
            data: "fr1",
        },
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
                ? `(${!nodeData?.servers ? "N/A" : nodeData.servers} / ${d.maxCount}) [${Math.round(
                      Number.isNaN(ping.ping) ? 0 : ping.ping
                  )}ms]`
                : "" || d.data.toLowerCase().includes("dono")
                ? `(${!nodeData?.servers ? "N/A" : nodeData.servers} / ${d.maxCount}) [${Math.round(
                      Number.isNaN(ping.ping) ? 0 : ping.ping
                  )}ms]`
                : "" || d.data.toLowerCase().startsWith("pnode")
                ? `(${!nodeData?.servers ? "N/A" : nodeData.servers} / ${d.maxCount}) [${Math.round(
                      Number.isNaN(ping.ping) ? 0 : ping.ping
                  )}ms]`
                : "";

            da =
                da.maintenance
                    ? `🟣 Maintenance`
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

    let embed = new Discord.MessageEmbed().setTitle("DanBot Status").setDescription(desc).setTimestamp();
    return embed;
};

module.exports = {
    parse: parse,
    getEmbed: getEmbed,
};
