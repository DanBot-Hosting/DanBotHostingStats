const axios = require('axios');
var ping = require('ping');
const ping2 = require('ping-tcp-js')

let stats = {
    node1: {
        serverID: '99d65091',
        IP: '154.27.68.232'
    },
    node2: {
        serverID: '0cb9a74e',
        IP: '154.27.68.233'
    },
    node3: {
        serverID: '373fafce',
        IP: '167.86.113.158'
    },
    node4: {
        serverID: '98ca4dbd',
        IP: '51.38.69.73'
    },
    node5: {
        serverID: '97e64d11',
        IP: '154.27.68.244'
    },
    node6: {
        serverID: null,
        IP: '154.27.68.245'
    },
    node7: {
        serverID: '94082df3',
        IP: '154.27.68.186'
    },
}

console.log("NodeChecker Online");
//Node status 
setInterval(() => {
    console.log("Checking Nodes...");

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
                status: "Online 🟢",
                is_vm_online: true
            });
        }).catch(error => {

            axios({
                url: 'http://' + data.IP + ':999',
                method: 'GET',
                followRedirect: true,
                maxRedirects: 5,
                timeout: 1500,
            }).then(x => {
                nodeStatus.set(node, {
                    status: "Offline 🔴",
                    is_vm_online: true
                });
            }).catch(err => {
                nodeStatus.set(node, {
                    status: "Offline 🔴",
                    is_vm_online: false
                });
            });
        })
    }

    //Node 1 (PRIVATE ADMIN PANEL)
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
            status: "Online 🟢"
        });
    }).catch(error => {
        nodeStatus.set("node1-priv", {
            status: "Offline 🔴"
        });
    })

    //Node 1 (PUBLIC GAMESERVER PANEL)
    axios({
        url: config.PubPterodactyl.hosturl + "/api/client/servers/c9efcb30/resources",
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        }
    }).then(response => {
        nodeStatus.set("pub_node1", {
            status: "Online 🟢"
        });
    }).catch(error => {
        nodeStatus.set("pub_node1", {
            status: "Offline 🔴"
        });
    })

    // Panel Cherckers
    var hosts = ['154.27.68.234', 'panel.danbot.host', 'mail.danbot.host', 'api.danbot.host', 'admin.danbot.host', 'pub.danbot.host'];
    hosts.forEach(function (host) {
        ping.sys.probe(host, function (isAlive) {
            if (isAlive == true) {
                nodeStatus.set(host, {
                    status: "Online 🟢"
                })
            } else if (isAlive == false) {
                nodeStatus.set(host, {
                    status: "Offline 🔴"
                });
            }
        });
    }, {
        timeout: 4
    });


    //Lavalink chercker
    ping2.ping('lava.danbot.host', 2333)
        .then(() => nodeStatus.set("lava.danbot.host", {
            status: "Online 🟢"
        }))
        .catch((e) => nodeStatus.set("lava.danbot.host", {
            status: "Offline 🔴"
        }));

    ping2.ping('lava2.danbot.host', 2333)
        .then(() => nodeStatus.set("lava2.danbot.host", {
            status: "Online 🟢"
        }))
        .catch((e) => nodeStatus.set("lava2.danbot.host", {
            status: "Offline 🔴"
        }));

}, 3000)