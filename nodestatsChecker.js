const axios = require('axios');
var ping = require('ping');
const ping2 = require('ping-tcp-js')

let stats = {
    node1: {
        serverID: '7c740e8c',
        IP: '142.54.191.91'
    },
    node2: {
        serverID: '5c82cea0',
        IP: '142.54.191.93'
    },
    node3: {
        serverID: '57622dc8',
        IP: '167.86.113.158'
    },
    node4: {
        serverID: '98ca4dbd',
        IP: '178.159.3.233'
    },
    node5: {
        serverID: '6d83e569',
        IP: '154.27.68.108'
    },
    node6: {
        serverID: '8565f2e0',
        IP: '194.146.44.129'
    },
    node7: {
        serverID: '94082df3',
        IP: '142.54.191.92'
    },
    node8: {
        serverID: '8e1d9c32',
        IP: '194.146.44.168'
    },
    node9: {
        serverID: 'a0493565',
        IP: '194.146.44.41'
    },
    node10: {
        serverID: '3c93984c',
        IP: '194.146.44.58'
    },
    node11: {
        serverID: '0267242c',
        IP: '178.159.2.82'
    },
    node12: {
        serverID: '4526d28b',
        IP: '178.159.2.89'
    },
    node13: {
        serverID: '8bb3a785',
        IP: '178.159.3.205'
    },
    node14: {
        serverID: '7ad8c41b',
        IP: '194.146.44.188'
    },

    storage1: {
        serverID: 'b2af1392',
        IP: '194.146.44.73'
    },
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
                status: true,
                is_vm_online: true
            });
        }).catch(error => {
            ping2.ping(data.IP, 22)
                .then(() => nodeStatus.set(node, {
                    status: false,
                    is_vm_online: true
                }))
                .catch((e) => nodeStatus.set(node, {
                    status: false,
                    is_vm_online: false
                }));
        })
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
            status: true
        });
    }).catch(error => {
        nodeStatus.set("node1-priv", {
            status: false
        });
    })

    //Node 1
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
            status: true
        });
    }).catch(error => {
        nodeStatus.set("dan-node1", {
            status: false
        });
    })

    // Panel Cherckers
    var hosts = ['63.141.228.92', 'panel.danbot.host', 'mail.danbot.host', 'api.danbot.host', 'admin.danbot.host', 'private.danbot.host'];
    hosts.forEach(function (host) {
        ping.sys.probe(host, function (isAlive) {
            if (isAlive == true) {
                nodeStatus.set(host, {
                    status: true
                })
            } else if (isAlive == false) {
                nodeStatus.set(host, {
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
            status: true
        }))
        .catch((e) => nodeStatus.set("panelus", {
            status: false
        }));
    ping2.ping('208.68.39.241', 80) // Panel 1
        .then(() => nodeStatus.set("panelus1", {
            status: true
        }))
        .catch((e) => nodeStatus.set("panelus1", {
            status: false
        }));
    ping2.ping('176.31.125.135', 3306)
        .then(() => nodeStatus.set("dbhdb", {
            status: true
        }))
        .catch((e) => nodeStatus.set("dbhdb", {
            status: false
        }));

    //UK VM Storage 1
    ping2.ping('178.159.3.233', 44)
        .then(() => nodeStatus.set("ukvms1", {
            status: true
        }))
        .catch((e) => nodeStatus.set("ukvms1", {
            status: false
        }));

    //Backup Storage
    ping2.ping('176.31.125.135', 22)
        .then(() => nodeStatus.set("backups1", {
            status: true
        }))
        .catch((e) => nodeStatus.set("backups1", {
            status: false
        }));

    //Lavalink chercker
    ping2.ping('lava.danbot.host', 2333)
        .then(() => nodeStatus.set("lava.danbot.host", {
            status: true
        }))
        .catch((e) => nodeStatus.set("lava.danbot.host", {
            status: false
        }));

    ping2.ping('lava2.danbot.host', 2333)
        .then(() => nodeStatus.set("lava2.danbot.host", {
            status: true
        }))
        .catch((e) => nodeStatus.set("lava2.danbot.host", {
            status: false
        }));

}, 3000)
