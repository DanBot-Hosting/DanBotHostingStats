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
        IP: '63.141.228.91',
        ID: '11'
    },
    node5: {
        serverID: '6d83e569',
        IP: '63.141.228.90',
        ID: '12'
    },
    node6: {
        serverID: '8565f2e0',
        IP: '5.196.100.232',
        ID: '13'
    },
    node7: {
        serverID: '94082df3',
        IP: '158.69.123.177',
        ID: '14'
    },
    node8: {
        serverID: '8e1d9c32',
        IP: '5.196.100.234',
        ID: '17'
    },
    node9: {
        serverID: 'a0493565',
        IP: '5.196.100.233',
        ID: '18'
    },
    node10: {
        serverID: '3c93984c',
        IP: '5.196.100.235',
        ID: '20'
    },
    node11: {
        serverID: 'bfa1776e',
        IP: '5.196.100.236',
        ID: '21'
    },
    node12: {
        serverID: '4526d28b',
        IP: '5.196.100.237',
        ID: '22'
    },
    node13: {
        serverID: '8bb3a785',
        IP: '5.196.100.238',
        ID: '23'
    },
    node14: {
        serverID: '4653577d',
        IP: '5.196.100.239',
        ID: '24'
    },
    node15: {
        serverID: '37126bc4',
        IP: '137.74.76.69',
        ID: '27'
    },
    node16: {
        serverID: 'bfb242d8',
        IP: '137.74.76.68',
        ID: '26'
    },
    node17: {
        serverID: 'a73b3514',
        IP: '137.74.76.70',
        ID: '28'
    },
    node18: {
        serverID: '058d7a69',
        IP: '137.74.76.71',
        ID: '29'
    },
}
if (enabled.nodestatsChecker === true) {
console.log(chalk.magenta('[Nodes Checker] ') + chalk.green("Enabled and Online"));
//Node status
setInterval(() => {
    //Public nodes
    for (let [node, data] of Object.entries(stats)) {
        setTimeout(() => {
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
                nodeServers.set(node, {servers: servercount.length})
            }).catch(err => {
            })
        }, 500)
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
    ping2.ping('panel.danbot.host', 80) // Panel 1
        .then(() => nodeStatus.set("panelus1", {
            timestamp: Date.now(),
            status: true
        }))
        .catch((e) => nodeStatus.set("panelus1", {
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
        .then(() => nodeStatus.set("vps-server-01", {
            timestamp: Date.now(),
            status: true
        }))
        .catch((e) => nodeStatus.set("vps-server-01", {
            timestamp: Date.now(),
            status: false
        }));

}, 10000)
} else {
    console.log(chalk.magenta('[Nodes Checker] ') + chalk.red("Disabled"));
}
