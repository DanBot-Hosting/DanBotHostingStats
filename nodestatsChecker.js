const axios = require('axios');
var ping = require('ping');
const ping2 = require('ping-tcp-js')

let pingLocals = {
    "UK": config.Ping.UK,
    "CA": config.Ping.CA
}

let stats = {
    node1: {
        serverID: '7c740e8c',
        IP: '176.31.203.22',
        ID: '1',
        Location: pingLocals.UK
    },
    node2: {
        serverID: 'ca89e5c6',
        IP: '176.31.203.21',
        ID: '2',
        Location: pingLocals.UK
    },
    node3: {
        serverID: 'a35842f2',
        IP: '176.31.203.25',
        ID: '7',
        Location: pingLocals.UK
    },
    node4: {
        serverID: '7372a1e9',
        IP: '176.31.203.23',
        ID: '11',
        Location: pingLocals.UK
    },
    node5: {
        serverID: '9f41832d',
        IP: '176.31.203.24',
        ID: '12',
        Location: pingLocals.UK
    },
    node6: {
        serverID: 'f9453eca',
        IP: '176.31.203.26',
        ID: '13',
        Location: pingLocals.UK
    },
    node7: {
        serverID: 'e611fc3f',
        IP: '176.31.203.20',
        ID: '36',
        Location: pingLocals.UK
    }, node8: {
        serverID: 'de45b1f4',
        IP: '176.31.203.27',
        ID: '37',
        Location: pingLocals.UK
    },
    dono01: {
        serverID: 'bd9d3ad6',
        IP: '149.56.23.207',
        ID: '34',
        Location: pingLocals.CA
    },
    dono02: {
        serverID: 'ca6dba5a',
        IP: '192.95.42.70',
        ID: '31',
        Location: pingLocals.CA
    },
    dono03: {
        serverID: 'c23f92cb',
        IP: '5.196.239.154',
        ID: '33',
        Location: pingLocals.UK
    },
    dono04: {
        serverID: '9b812dbf',
        IP: '176.31.203.28',
        ID: '35',
        Location: pingLocals.UK
    },
     pnode1: {
        serverID: '1f6b4ee2',
        IP: '176.31.203.30',
        ID: '38',
        Location: pingLocals.UK
     }
}
if (enabled.nodestatsChecker === true) {
    console.log(chalk.magenta('[Nodes Checker] ') + chalk.green("Enabled and Online"));
    //Node status
    setInterval(() => {
        //Public nodes
        for (let [node, data] of Object.entries(stats)) {
            setTimeout(() => {
                axios({
                    url: "http://" + data.Location + `?ip=${data.IP}&port=22`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(response => {
                    nodePing.set(node, {
                        ip: response.data.address,
                        ping: response.data.ping
                    })
                })

                axios({
                    url: config.Pterodactyl.hosturl + "/api/client/servers/" + data.serverID + "/resources",
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(response => {
                    //Node is online and is working. Just checking if it's in maintenance or not.

                    if (nodeStatus.fetch(node + '.maintenance')) {
                        nodeStatus.set(node, {
                            timestamp: Date.now(),
                            status: true,
                            is_vm_online: true,
                            maintenance: true
                        });
                   } else {
                        nodeStatus.set(node, {
                            timestamp: Date.now(),
                            status: true,
                            is_vm_online: true,
                            maintenance: false
                        });
                   };
                }).catch(error => {
                    //Node is either offline or wings are offline. Checks if it's maintenance, and then checks for wings.

                    if(nodeStatus.fetch(node + '.maintenance')){
                        ping2.ping(data.IP, 22).then(() => {
                            nodeStatus.set(node, {
                                timestamp: Date.now(),
                                status: false,
                                is_vm_online: true,
                                maintenance: true
                            });
                        }).catch((e) => {
                            nodeStatus.set(node, {
                                timestamp: Date.now(),
                                status: false,
                                is_vm_online: false,
                                maintenance: true
                            });
                        });
                    } else {
                        ping2.ping(data.IP, 22).then(() => {
                            nodeStatus.set(node, {
                                timestamp: Date.now(),
                                status: false,
                                is_vm_online: true,
                                maintenance: false
                            });
                        }).catch((e) => {
                            nodeStatus.set(node, {
                                timestamp: Date.now(),
                                status: false,
                                is_vm_online: false,
                                maintenance: false
                            });
                        });
                    };
                });

                setTimeout(() => {
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/nodes/" + data.ID + "/allocations?per_page=5000",
                        method: 'GET',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        }
                    }).then(response => {
                        const servercount = response.data.data.filter(m => m.attributes.assigned == true).length;
                        nodeServers.set(node, {
                            servers: servercount
                        })
                    }).catch(err => {})
                }, 2000)
            }, 2000)
        }

        //France 1 VPS Server
        ping2.ping('176.31.125.135', 22)
            .then(() => nodeStatus.set("vpsfrance-1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("vpsfrance-1", {
                timestamp: Date.now(),
                status: false
            }));


        //Canada 1 VPS Server
        ping2.ping('51.222.40.140', 22)
            .then(() => nodeStatus.set("vpscanada-1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("vpscanada-1", {
                timestamp: Date.now(),
                status: false
            }));


        //Germany 1 VPN Server
        ping2.ping('51.89.32.64', 22)
            .then(() => nodeStatus.set("germany1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("germany1", {
                timestamp: Date.now(),
                status: false
            }));


        //France 1 VPN Server
        ping2.ping('176.31.125.135', 22)
            .then(() => nodeStatus.set("france1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("france1", {
                timestamp: Date.now(),
                status: false
            }));


        //Canada 1 VPN Server
        ping2.ping('51.222.40.140', 22)
            .then(() => nodeStatus.set("canada1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("canada1", {
                timestamp: Date.now(),
                status: false
            }));

    }, 10000)
} else {
    console.log(chalk.magenta('[Nodes Checker] ') + chalk.red("Disabled"));
}
