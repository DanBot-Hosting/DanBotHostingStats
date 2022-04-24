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
        serverID: '94082df3',
        IP: '176.31.203.27',
        ID: '14',
        Location: pingLocals.UK
    },
    node8: {
        serverID: '7be82ca6',
        IP: '176.31.203.20',
        ID: '17',
        Location: pingLocals.UK
    },
    node13: {
        serverID: 'b90c157a',
        IP: '5.196.100.238',
        ID: '23',
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
        IP: '192.95.42.73',
        ID: '33',
        Location: pingLocals.CA
    },
    dono04: {
        serverID: '9b812dbf',
        IP: '176.31.203.28',
        ID: '35',
        Location: pingLocals.CA
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
                    if(nodeStatus.fetch(node + '.maintenance')) {
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
                   }
                }).catch(error => {
                    ping2.ping(data.IP, 22)
                        .then(() => nodeStatus.set(node, {
                        timestamp: Date.now(),
                        status: false,
                        is_vm_online: true,
                        maintenance: false
                    }))
                        .catch((e) =>
                       nodeStatus.set(node, {
                        timestamp: Date.now(),
                        status: false,
                        is_vm_online: false,
                        maintenance: false
                    }));
                })

                axios({
                    url: config.Pterodactyl.hosturl + "/api/application/nodes/" + data.ID + "?include=servers",
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(response => {
                    const servercount = response.data.attributes.relationships.servers.data;
                    nodeServers.set(node, {
                        servers: servercount.length
                    })
                }).catch(err => {})
            }, 800)
        }

        //Server limit

        //Node servers checker
        axios({
            url: config.PrivPterodactyl.hosturl + "/api/client/servers/88a20baf/resources",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.PrivPterodactyl.apikeyclient,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            nodeStatus.set("node1-priv", {
                timestamp: Date.now(),
                status: true
            });
        }).catch(error => {
            nodeStatus.set("node1-priv", {
                timestamp: Date.now(),
                status: false
            });
        })

        //Dan's Node 1
        axios({
            url: config.DanPterodactyl.hosturl + "/api/client/servers/019b6467/resources",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.DanPterodactyl.apikeyclient,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            nodeStatus.set("dan-node1", {
                timestamp: Date.now(),
                status: true
            });
        }).catch(error => {
            nodeStatus.set("dan-node1", {
                timestamp: Date.now(),
                status: false
            });
        })

        // Panel Cherckers
        var hosts = ['164.132.74.251', 'panel.danbot.host', 'mail.danbot.host', 'api.danbot.host', 'admin.danbot.host', 'private.danbot.host'];
        hosts.forEach(function(host) {
            ping.sys.probe(host, function(isAlive) {
                if (isAlive == true) {
                    nodeStatus.set(host, {
                        timestamp: Date.now(),
                        status: true
                    })
                } else if (isAlive == false) {
                    nodeStatus.set(host, {
                        timestamp: Date.now(),
                        status: false
                    });
                }
            });
        }, {
            timeout: 4
        });

        //Panel stuffs
        ping2.ping('157.230.202.210', 80) // Panel 1
            .then(() => nodeStatus.set("panelus", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("panelus", {
                timestamp: Date.now(),
                status: false
            }));
        ping2.ping('panel.danbot.host', 80) // Panel 1
            .then(() => nodeStatus.set("panelus1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("panelus1", {
                timestamp: Date.now(),
                status: false
            }));

        ping2.ping('51.161.33.34', 3306) // Panel 1
            .then(() => nodeStatus.set("mysqldatabases", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("mysqldatabases", {
                timestamp: Date.now(),
                status: false
            }));

        //Backup Storage
        axios({
            url: config.DanPterodactyl.hosturl + "/api/client/servers/6aa54402/resources",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.DanPterodactyl.apikeyclient,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            nodeStatus.set("backups1", {
                timestamp: Date.now(),
                status: true
            });
        }).catch(error => {
            nodeStatus.set("backups1", {
                timestamp: Date.now(),
                status: false
            });
        })

        //Lavalink chercker
        ping2.ping('lava.danbot.host', 2333)
            .then(() => nodeStatus.set("lava.danbot.host", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("lava.danbot.host", {
                timestamp: Date.now(),
                status: false
            }));

        ping2.ping('lava2.danbot.host', 2333)
            .then(() => nodeStatus.set("lava2.danbot.host", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("lava2.danbot.host", {
                timestamp: Date.now(),
                status: false
            }));

        ping2.ping('176.31.125.135', 22)
            .then(() => nodeStatus.set("vpsfrance-1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("vpsfrance-1", {
                timestamp: Date.now(),
                status: false
            }));

        ping2.ping('51.222.40.140', 22)
            .then(() => nodeStatus.set("vpscanada-1", {
                timestamp: Date.now(),
                status: true
            }))
            .catch((e) => nodeStatus.set("vpscanada-1", {
                timestamp: Date.now(),
                status: false
            }));

    }, 10000)
} else {
    console.log(chalk.magenta('[Nodes Checker] ') + chalk.red("Disabled"));
}
