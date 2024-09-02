const axios = require('axios');
const ping = require('ping-tcp-js');
const db = require('quick.db');
const Discord = require('discord.js');
const Chalk = require('chalk');

const Config = require('../config.json');
const Status = require('../config/status-configs.js');

const nodeStatus = new db.table("nodeStatus"); //Status of the Node.
const nodeServers = new db.table("nodeServers"); //Counts of servers on each Node.

function startNodeChecker() {

    if (Config.Enabled.nodestatsChecker == false) return console.log(Chalk.magenta("[NODE CHECKER] ") + Chalk.redBright("Disabled"));

    console.log(Chalk.magenta("[NODE CHECKER] ") + Chalk.greenBright("Enabled"));

    setInterval(() => {
        // For Node Status.
        for (const [category, nodes] of Object.entries(Status.Nodes)) {
            for (const [node, data] of Object.entries(nodes)) {
                setTimeout(() => {

                        // Perform Pterodactyl Panel requests.
                        axios({
                            url: `${Config.Pterodactyl.hosturl}/api/client/servers/${data.serverID}/resources`,
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${Config.Pterodactyl.apikeyclient}`,
                                "Content-Type": "application/json",
                                Accept: "Application/vnd.pterodactyl.v1+json",
                            },
                        })
                            .then((response) => {
                                // Node & Wings are online.
                                
                                nodeStatus.set(`${node}.timestamp`, Date.now());
                                nodeStatus.set(`${node}.status`, true);
                                nodeStatus.set(`${node}.is_vm_online`, true);
                            })
                            .catch((error) => {                                    
                                ping.ping(data.IP, 22)
                                    .then(() => {
                                        // Wings is offline, but Node is online.

                                        nodeStatus.set(`${node}.timestamp`, Date.now());
                                        nodeStatus.set(`${node}.status`, false);
                                        nodeStatus.set(`${node}.is_vm_online`, true);
                                    })
                                    .catch((e) => {
                                        // Node & Wings are offline.
                                        
                                        nodeStatus.set(`${node}.timestamp`, Date.now());
                                        nodeStatus.set(`${node}.status`, false);
                                        nodeStatus.set(`${node}.is_vm_online`, false);
                                    });
                            });

                        //Sets the Node Allocation usage and amount of slots total.
                        setTimeout(() => {
                            axios({
                                url: `${Config.Pterodactyl.hosturl}/api/application/nodes/${data.ID}/allocations?per_page=9000`,
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                                    "Content-Type": "application/json",
                                    Accept: "Application/vnd.pterodactyl.v1+json",
                                },
                            })
                                .then((response) => {
                                    const serverCount = response.data.data.filter(m => m.attributes.assigned).length;

                                    nodeServers.set(`${node}.servers`, serverCount);
                                    nodeServers.set(`${node}.maxCount`, response.data.meta.pagination.total);
                                })
                                .catch((Error) => {
                                    console.error('[NODE CHECKER] Error fetching node servers | ' + Error);
                                });
                        }, 2000);
                }, 2000);
            }
        }

        // Other Services.
        for (const [category, services] of Object.entries(Status)) {
            if (category !== "Nodes") {
                for (const [name, data] of Object.entries(services)) {

                    setTimeout(() => {
                        ping.ping(data.IP, 22)
                            .then(() => {
                                nodeStatus.set(`${name}.timestamp`, Date.now());
                                nodeStatus.set(`${name}.status`, true);
                            })
                            .catch(() => {
                                nodeStatus.set(`${name}.timestamp`, Date.now());
                                nodeStatus.set(`${name}.status`, false);
                            });
                    }, 2000);
                }
            }
        }
    }, 10000);
}

const parseStatus = () => {
    let toReturn = {};

    // Handle Nodes categories.
    for (let [category, nodes] of Object.entries(Status.Nodes)) {
        let temp = [];
        for (let [nodeKey, data] of Object.entries(nodes)) {

            let nodeStatusData = nodeStatus.get(nodeKey.toLowerCase());
            let nodeServerData = nodeServers.get(nodeKey.toLowerCase());

            let serverUsage = nodeServerData
                ? `(${nodeServerData.servers} / ${nodeServerData.maxCount})`
                : "";

            let statusText;
            if (nodeStatusData?.maintenance) {
                statusText = `🟣 Maintenance ~ Returning Soon!`;
            } else if (nodeStatusData?.status) {
                statusText = `🟢 Online ${serverUsage}`;
            } else {
                if (nodeStatusData?.is_vm_online == null) {
                    statusText = "🔴 **Offline**";
                } else {
                    statusText = (nodeStatusData.is_vm_online ? "🟠 **Wings**" : "🔴 **System**") + 
                        ` **offline** ${serverUsage}`;
                }
            }

            temp.push(`${data.Name}: ${statusText}`);
        }
        toReturn[category] = temp;
    }

    // Handle other categories.
    for (let [category, services] of Object.entries(Status)) {
        if (category !== "Nodes") {
            let temp = [];
            for (let [name, data] of Object.entries(services)) {

                let serviceStatusData = nodeStatus.get(name.toLowerCase());

                let statusText = serviceStatusData?.status ? "🟢 Online" : "🔴 **Offline**";

                temp.push(`${data.name}: ${statusText}`);
            }
            toReturn[category] = temp;
        }
    }

    return toReturn;
};


const getEmbed = async () => {
    let status = parseStatus();
    let desc = "";

    for (let [title, d] of Object.entries(status)) {
        desc = `${desc}***${title}***\n${d.join("\n")}\n\n`;
    }

    const Embed = new Discord.EmbedBuilder();

    Embed.setTitle("DBH Service Status");
    Embed.setDescription(desc);
    Embed.setTimestamp();
    Embed.setColor("#7388d9");
    Embed.setFooter({ text: "Last Updated" });

    return Embed;
};

module.exports = { startNodeChecker, parseStatus, getEmbed };
