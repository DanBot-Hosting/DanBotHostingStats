const axios = require("axios");
const ping = require("ping-tcp-js");

let pingLocals = {
    UK: config.Ping.UK,
    CA: config.Ping.CA,
};

let stats = {
    node4: {
        serverID: "7372a1e9",
        IP: "176.31.203.23",
        ID: "11",
        Location: pingLocals.UK,
    },
    node5: {
        serverID: "9f41832d",
        IP: "176.31.203.24",
        ID: "12",
        Location: pingLocals.UK,
    },
    node6: {
        serverID: "f9453eca",
        IP: "176.31.203.26",
        ID: "13",
        Location: pingLocals.UK,
    },
    node7: {
        serverID: "e611fc3f",
        IP: "176.31.203.20",
        ID: "36",
        Location: pingLocals.UK,
    },
    node8: {
        serverID: "de45b1f4",
        IP: "176.31.203.27",
        ID: "37",
        Location: pingLocals.UK,
    },
    dono01: {
        serverID: "bd9d3ad6",
        IP: "63.141.249.43",
        ID: "34",
        Location: pingLocals.CA,
    },
    dono02: {
        serverID: "ca6dba5a",
        IP: "192.95.42.70",
        ID: "31",
        Location: pingLocals.CA,
    },
    dono03: {
        serverID: "c23f92cb",
        IP: "51.68.194.254",
        ID: "33",
        Location: pingLocals.UK,
    },
    dono04: {
        serverID: "9b812dbf",
        IP: "51.68.209.0",
        ID: "35",
        Location: pingLocals.UK,
    },
    dono05: {
        serverID: "b06ae45f",
        IP: "54.38.75.143",
        ID: "39",
        Location: pingLocals.UK,
    },
    pnode1: {
        serverID: "1f6b4ee2",
        IP: "51.68.201.44",
        ID: "38",
        Location: pingLocals.UK,
    },
    pnode2: {
        serverID: "2358ca8e",
        IP: "51.89.140.125",
        ID: "40",
        Location: pingLocals.UK,
    },
    pnode3: {
        serverID: "e611fc3f",
        IP: "51.89.140.124",
        ID: "40",
        Location: pingLocals.UK,
    },
    pnode4: {
        serverID: "e611fc3f",
        IP: "51.89.140.126",
        ID: "40",
        Location: pingLocals.UK,
    },
};
if (enabled.nodestatsChecker === true) {
    console.log(chalk.magenta("[NODE CHECKER] ") + chalk.green("Enabled / Online"));
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

                    if(isNaN(pingData)){
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
                        url:
                            config.Pterodactyl.hosturl +
                            "/api/application/nodes/" +
                            data.ID +
                            "/allocations?per_page=5000",
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

        // AU 1 VPN Server
        ping
            .ping("139.99.171.195", 22)
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
            .ping("176.31.125.135", 22)
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
            .ping("69.197.129.206", 22)
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
    }, 10000);
} else {
    console.log(chalk.magenta("[NODE CHECKER] ") + chalk.red("Disabled"));
}
