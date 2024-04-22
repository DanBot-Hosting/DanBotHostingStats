const axios = require("axios");
const ping = require("ping-tcp-js");

let pingLocals = {
    UK: config.Ping.UK,
    CA: config.Ping.CA,
};

let stats = {
    dono01: {
        serverID: "bd9d3ad6",
        IP: config.Nodes.Dono1,
        ID: "34",
        Location: pingLocals.UK,
    },
    dono02: {
        serverID: "ca6dba5a",
        IP: config.Nodes.Dono2,
        ID: "31",
        Location: pingLocals.UK,
    },
    dono03: {
        serverID: "c23f92cb",
        IP: config.Nodes.Dono3,
        ID: "33",
        Location: pingLocals.UK,
    },
    pnode1: {
        serverID: "7e99f988",
        IP: config.Nodes.PNode1,
        ID: "38",
        Location: pingLocals.UK,
    },
    pnode2: {
        serverID: "2358ca8e",
        IP: config.Nodes.PNode2,
        ID: "40",
        Location: pingLocals.UK,
    },
    pnode3: {
        serverID: "150791a9",
        IP: config.Nodes.PNode3,
        ID: "43",
        Location: pingLocals.UK,
    },
    storage1: {
        serverID: "ed33bb0c",
        IP: config.Nodes.Storage1,
        ID: "44",
        Location: pingLocals.UK,
    }
};
if (enabled.nodestatsChecker) {
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
                }).then((response) => {
                    let pingData = response.data.ping;

                    if (isNaN(pingData)) {
                        pingData = "0";
                    };

                    nodePing.set(node, {
                        ip: response.data.address,
                        ping: pingData,
                    });
                }).catch((Error) => {
                    //Handling errors? You mean just ignoring them of course.
                });

                axios({
                        url: config.Pterodactyl.hosturl + "/api/client/servers/" + data.serverID + "/resources",
                        method: "GET",
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            Authorization: "Bearer " + config.Pterodactyl.apikeyclient,
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

                        ping
                            .ping(data.IP, 22)
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
                        url: config.Pterodactyl.hosturl +
                            "/api/application/nodes/" +
                            data.ID +
                            "/allocations?per_page=9000",
                        method: "GET",
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            Authorization: "Bearer " + config.Pterodactyl.apikey,
                            "Content-Type": "application/json",
                            Accept: "Application/vnd.pterodactyl.v1+json",
                        },
                    }).then((response) => {
                        const servercount = response.data.data.filter((m) => m.attributes.assigned == true).length;
                        nodeServers.set(node, {
                            servers: servercount,
                        });
                    }).catch((err) => {});
                }, 2000);
            }, 2000);
        }
    }, 10000);

        setInterval(() => {
        // AU 1 VPN Server
        ping
            .ping(config.VPN.AU1, 22)
            .then(() =>
                nodeStatus.set("au1", {
                    timestamp: Date.now(),
                    status: true,
                })
            )
            .catch((e) =>
                nodeStatus.set("au1", {
                    timestamp: Date.now(),
                    status: false,
                })
            );

        // FR 1 VPN Server
        ping
            .ping(config.VPN.FR1, 22)
            .then(() =>
                nodeStatus.set("fr1", {
                    timestamp: Date.now(),
                    status: true,
                })
            )
            .catch((e) =>
                nodeStatus.set("fr1", {
                    timestamp: Date.now(),
                    status: false,
                })
            );

        // US 1 VPN Server
        ping
            .ping(config.VPN.US1, 22)
            .then(() =>
                nodeStatus.set("us1", {
                    timestamp: Date.now(),
                    status: true,
                })
            )
            .catch((e) =>
                nodeStatus.set("us1", {
                    timestamp: Date.now(),
                    status: false,
                })
            );

        // US 1 - VM Host
        ping
            .ping(config.Servers.US1, 22)
            .then(() =>
                nodeStatus.set("vm-us-1", {
                    timestamp: Date.now(),
                    status: true,
                })
            )
            .catch((e) =>
                nodeStatus.set("vm-us-1", {
                    timestamp: Date.now(),
                    status: false,
                })
            );
        // EU 1 - VM Host
        ping
            .ping(config.Servers.EU1, 22)
            .then(() =>
                nodeStatus.set("vm-eu-1", {
                    timestamp: Date.now(),
                    status: true,
                })
            )
            .catch((e) =>
                nodeStatus.set("vm-eu-1", {
                    timestamp: Date.now(),
                    status: false,
                })
            );

            // Proxmox
            ping
                .ping(config.Servers.US1, 8006)
                .then(() =>
                    nodeStatus.set("proxmox", {
                        timestamp: Date.now(),
                        status: true,
                    })
                )
                .catch((e) =>
                    nodeStatus.set("proxmox", {
                        timestamp: Date.now(),
                        status: false,
                    })
                );
            // Grafana
            ping
                .ping(config.Services.grafana, 443)
                .then(() =>
                    nodeStatus.set("grafana", {
                        timestamp: Date.now(),
                        status: true,
                    })
                )
                .catch((e) =>
                    nodeStatus.set("grafana", {
                        timestamp: Date.now(),
                        status: false,
                    })
                );
            // Ptero - Public
            ping
                .ping(config.Services.pteropublic, 443)
                .then(() =>
                    nodeStatus.set("pterodactylpublic", {
                        timestamp: Date.now(),
                        status: true,
                    })
                )
                .catch((e) =>
                    nodeStatus.set("pterodactylpublic", {
                        timestamp: Date.now(),
                        status: false,
                    })
                );
            // Ptero - Core
            ping
                .ping(config.Services.pterocore, 443)
                .then(() =>
                    nodeStatus.set("pterodactylcore", {
                        timestamp: Date.now(),
                        status: true,
                    })
                )
                .catch((e) =>
                    nodeStatus.set("pterodactylcore", {
                        timestamp: Date.now(),
                        status: false,
                    })
                );
            // VPN API
            ping
                .ping(config.Services.vpnapi, 1110)
                .then(() =>
                    nodeStatus.set("vpnapi", {
                        timestamp: Date.now(),
                        status: true,
                    })
                )
                .catch((e) =>
                    nodeStatus.set("vpnapi", {
                        timestamp: Date.now(),
                        status: false,
                    })
                );
    }, 10000);
} else {
    console.log(chalk.magenta("[NODE CHECKER] ") + chalk.red("Disabled"));
}
