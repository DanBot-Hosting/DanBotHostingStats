const axios = require('axios');
const ping = require('ping-tcp-js');
const db = require('quick.db');
const Discord = require('discord.js');
const Chalk = require('chalk');

const Config = require('../config.json');
const Status = require('../config/status-configs.js');

function startNodeChecker() {
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
                            .then(async (response) => {
                                // Node & Wings are online.
                                await nodeStatus.push(`${node}.timestamp`, Date.now());
                                await nodeStatus.push(`${node}.status`, true);  // Assuming node is online based on response
                                await nodeStatus.push(`${node}.is_vm_online`, true);  // Set is_vm_online to true
                            })
                            .catch((error) => {
                                ping.ping(data.IP, 22)
                                    .then(async () => {
                                        // Wings is offline, but Node is online.

                                        await nodeStatus.set(`${node}.timestamp`, Date.now());
                                        await nodeStatus.set(`${node}.status`, false);  // Assuming node is online based on response
                                        await nodeStatus.set(`${node}.is_vm_online`, true);  // Set is_vm_online to true
                                    })
                                    .catch(async (e) => {
                                        // Node & Wings are offline.

                                        await nodeStatus.set(`${node}.timestamp`, Date.now());
                                        await nodeStatus.set(`${node}.status`, false);  // Assuming node is online based on response
                                        await nodeStatus.set(`${node}.is_vm_online`, false);  // Set is_vm_online to true
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
                                .then(async (response) => {
                                    const serverCount = response.data.data.filter(m => m.attributes.assigned).length;

                                    await nodeServers.set(`${node}`, {
                                        servers: serverCount,
                                        maxCount: response.data.meta.pagination.total
                                    })
                                })
                                .catch((Error) => {
                                    // No need for additional debugs anymore.
                                    //console.error('[NODE CHECKER] Error fetching node servers | ' + Error);
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
                            .then(async () => {
                                await nodeStatus.set(`${name}.timestamp`, Date.now());
                                await nodeStatus.set(`${name}.status`, true);
                            })
                            .catch(async () => {
                                await nodeStatus.set(`${name}.timestamp`, Date.now());
                                await nodeStatus.set(`${name}.status`, false);
                            });
                    }, 2000);
                }
            }
        }
    }, 30 * 1000);
}

const parseStatus = async () => {
    let toReturn = {};

    // Handle Nodes categories.
    for (let [category, nodes] of Object.entries(Status.Nodes)) {
        let temp = [];
        for (let [nodeKey, data] of Object.entries(nodes)) {

            const nodeStatusData = await nodeStatus.get(nodeKey.toLowerCase());
            const nodeServerData = await nodeServers.get(nodeKey.toLowerCase());
            //console.log(nodeStatusData)
            //console.log(nodeServerData)

            let serverUsage = await nodeServerData
                ? `(${nodeServerData.servers} / ${nodeServerData.maxCount})`
                : "";

            let statusText;
            if (nodeStatusData?.maintenance) {
                statusText = `🟣 Maintenance ~ Returning Soon!`;
            } else if (nodeStatusData?.status) {
                statusText = `🟢 Online ${serverUsage}`;
            } else {
                if (nodeStatusData?.online == null) {
                    statusText = "🔴 **Offline**";
                } else {
                    statusText = (nodeStatusData.online ? "🟠 **Wings**" : "🔴 **System**") +
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

                let serviceStatusData = await nodeStatus.get(name.toLowerCase());

                let statusText = serviceStatusData?.status ? "🟢 Online" : "🔴 **Offline**";

                temp.push(`${data.name}: ${statusText}`);
            }
            toReturn[category] = temp;
        }
    }

    return toReturn;
};


const getEmbed = async () => {
    const status = await parseStatus();
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
