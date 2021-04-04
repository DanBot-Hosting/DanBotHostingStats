const axios = require('axios');
var ping = require('ping');
const ping2 = require('ping-tcp-js')

let stats = {
    node1: {
        serverID: '7c740e8c',
        IP: '142.54.191.91',
        ID: '1'
    },
    node2: {
        serverID: '5c82cea0',
        IP: '142.54.191.93',
        ID: '2'
    },
    node3: {
        serverID: '57622dc8',
        IP: '167.86.113.158',
        ID: '7'
    },
    node4: {
        serverID: '98ca4dbd',
        IP: '51.195.229.146',
        ID: '11'
    },
    node5: {
        serverID: '6d83e569',
        IP: '63.141.228.90',
        ID: '12'
    },
    node6: {
        serverID: '8565f2e0',
        IP: '51.195.253.240',
        ID: '13'
    },
    node7: {
        serverID: '94082df3',
        IP: '142.54.191.92',
        ID: '14'
    },
    node8: {
        serverID: '8e1d9c32',
        IP: '51.195.229.146',
        ID: '17'
    },
    node9: {
        serverID: 'a0493565',
        IP: '51.195.229.148',
        ID: '18'
    },
    node10: {
        serverID: '3c93984c',
        IP: '51.195.229.147',
        ID: '20'
    },
    node11: {
        serverID: '0267242c',
        IP: '51.195.229.146',
        ID: '21'
    },
    node12: {
        serverID: '4526d28b',
        IP: '51.195.229.146',
        ID: '22'
    },
    node13: {
        serverID: '8bb3a785',
        IP: '51.195.229.146',
        ID: '23'
    },
    node14: {
        serverID: '7ad8c41b',
        IP: '51.195.229.146',
        ID: '24'
    }
}

console.log(chalk.magenta('[Nodes Checker] ') + chalk.green("Online"));
//Node status
setInterval(() => {
    //console.log("Checking Nodes...");

    //Public nodes
    for (let [node, data] of Object.entries(stats)) {
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
            nodeStatus.set(node, {
                timestamp: Date.now(),
                status: true,
                is_vm_online: true
            });
        }).catch(error => {
            ping2.ping(data.IP, 22)
                .then(() => nodeStatus.set(node, {
                    timestamp: Date.now(),
                    status: false,
                    is_vm_online: true
                }))
                .catch((e) => nodeStatus.set(node, {
                    timestamp: Date.now(),
                    status: false,
                    is_vm_online: false
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
            nodeServers.set(node, { servers: servercount.length })
        }).catch(err => { })
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
    var hosts = ['63.141.228.92', 'panel.danbot.host', 'mail.danbot.host', 'api.danbot.host', 'admin.danbot.host', 'private.danbot.host'];
    hosts.forEach(function (host) {
        ping.sys.probe(host, function (isAlive) {
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
    ping2.ping('208.68.39.241', 80) // Panel 1
        .then(() => nodeStatus.set("panelus1", {
            timestamp: Date.now(),
            status: true
        }))
        .catch((e) => nodeStatus.set("panelus1", {
            timestamp: Date.now(),
            status: false
        }));
    /*
    ping2.ping('176.31.125.135', 3306)
        .then(() => nodeStatus.set("dbhdb", {
            status: true
        }))
        .catch((e) => nodeStatus.set("dbhdb", {
            status: false
        }));
*/
    //UK VM Storage 1
    ping2.ping('178.159.3.233', 22)
        .then(() => nodeStatus.set("ukvms1", {
            timestamp: Date.now(),
            status: true
        }))
        .catch((e) => nodeStatus.set("ukvms1", {
            timestamp: Date.now(),
            status: false
        }));

    //Backup Storage
    ping2.ping('176.31.125.135', 22)
        .then(() => nodeStatus.set("backups1", {
            timestamp: Date.now(),
            status: true
        }))
        .catch((e) => nodeStatus.set("backups1", {
            timestamp: Date.now(),
            status: false
        }));

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

}, 5000)
