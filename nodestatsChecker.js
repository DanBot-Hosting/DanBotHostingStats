const axios = require("axios");
const ping = require("ping-tcp-js");

const Config = require('./config.json');

let stats = {
    dono01: {
        serverID: "bd9d3ad6",
        IP: Config.Nodes.Dono1,
        ID: "34",
        Location: Config.Ping.UK,
    },
    dono02: {
        serverID: "ca6dba5a",
        IP: Config.Nodes.Dono2,
        ID: "31",
        Location: Config.Ping.UK,
    },
    dono03: {
        serverID: "c23f92cb",
        IP: Config.Nodes.Dono3,
        ID: "33",
        Location: Config.Ping.UK,
    },
    dono04: {
        serverID: "c095a2cb",
        IP: Config.Nodes.Dono4,
        ID: "46",
        Location: Config.Ping.UK,
    },
    pnode1: {
        serverID: "7e99f988",
        IP: Config.Nodes.PNode1,
        ID: "38",
        Location: Config.Ping.UK,
    },
    pnode2: {
        serverID: "2358ca8e",
        IP: Config.Nodes.PNode2,
        ID: "40",
        Location: Config.Ping.UK,
    },
    pnode3: {
        serverID: "150791a9",
        IP: Config.Nodes.PNode3,
        ID: "43",
        Location: Config.Ping.UK,
    },
    storage1: {
        serverID: "ed33bb0c",
        IP: Config.Nodes.Storage1,
        ID: "44",
        Location: Config.Ping.UK,
    },
};
if (Config.Enabled.nodestatsChecker) {
    console.log(chalk.magenta("[NODE CHECKER] ") + chalk.green("Enabled"));
    //Node status
    setInterval(() => {
        //Public nodes
        for (let [node, data] of Object.entries(stats)) {
            setTimeout(() => {
                axios({
                    url: "http://" + data.Location + `?ip=${data.IP}&port=22`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        let pingData = response.data.ping;

                        if (isNaN(pingData)) {
                            pingData = "0";
                        }

                        nodePing.set(node, {
                            ip: response.data.address,
                            ping: pingData,
                        });
                    })
                    .catch((error) => {
                        console.log(
                            chalk.magenta("[NODE CHECKER] ") +
                                chalk.red("Error: Unable to reach " + data.IP + " on port 22."),
                        );
                    });

                axios({
                    url:
                        Config.Pterodactyl.hosturl +
                        "/api/client/servers/" +
                        data.serverID +
                        "/resources",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: "Bearer " + Config.Pterodactyl.apikeyclient,
                        "Content-Type": "application/json",
                        Accept: "Application/vnd.pterodactyl.v1+json",
                    },
                })
                    .then((response) => {
                        //Node is online and is working. Just checking if it's in maintenance or not.

                        nodeStatus.set(`${node}.timestamp`, Date.now());
                        nodeStatus.set(`${node}.status`, true);
                        nodeStatus.set(`${node}.is_vm_online`, true);
                    })
                    .catch((error) => {
                        //Node is either offline or wings are offline. Checks if it's maintenance, and then checks for wings.

                        ping.ping(data.IP, 22)
                            .then(() => {
                                nodeStatus.set(`${node}.timestamp`, Date.now());
                                nodeStatus.set(`${node}.status`, false);
                                nodeStatus.set(`${node}.is_vm_online`, true);
                            })
                            .catch((e) => {
                                nodeStatus.set(`${node}.timestamp`, Date.now());
                                nodeStatus.set(`${node}.status`, false);
                                nodeStatus.set(`${node}.is_vm_online`, false);
                            });
                    });

                setTimeout(() => {
                    axios({
                        url:
                            Config.Pterodactyl.hosturl +
                            "/api/application/nodes/" +
                            data.ID +
                            "/allocations?per_page=9000",
                        method: "GET",
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            Authorization: "Bearer " + Config.Pterodactyl.apikey,
                            "Content-Type": "application/json",
                            Accept: "Application/vnd.pterodactyl.v1+json",
                        },
                    })
                        .then((response) => {
                            const servercount = response.data.data.filter(
                                (m) => m.attributes.assigned == true,
                            ).length;
                            nodeServers.set(node, {
                                servers: servercount,
                            });
                        })
                        .catch((err) => {});
                }, 2000);
            }, 2000);
        }
    }, 10000);

    setInterval(() => {
        // US 1 - VM Host
        ping.ping(Config.Servers.US1, 22)
            .then(() =>
                nodeStatus.set("vm-us-1", {
                    timestamp: Date.now(),
                    status: true,
                }),
            )
            .catch((e) =>
                nodeStatus.set("vm-us-1", {
                    timestamp: Date.now(),
                    status: false,
                }),
            );
        // EU 1 - VM Host
        ping.ping(Config.Servers.EU1, 22)
            .then(() =>
                nodeStatus.set("vm-eu-1", {
                    timestamp: Date.now(),
                    status: true,
                }),
            )
            .catch((e) =>
                nodeStatus.set("vm-eu-1", {
                    timestamp: Date.now(),
                    status: false,
                }),
            );

        // Ptero - Public
        ping.ping(Config.Services.pteropublic, 443)
            .then(() =>
                nodeStatus.set("pterodactylpublic", {
                    timestamp: Date.now(),
                    status: true,
                }),
            )
            .catch((e) =>
                nodeStatus.set("pterodactylpublic", {
                    timestamp: Date.now(),
                    status: false,
                }),
            );
    }, 10000);
} else {
    console.log(chalk.magenta("[NODE CHECKER] ") + chalk.red("Disabled"));
}
