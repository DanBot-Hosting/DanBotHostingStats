const axios = require('axios');
var ping = require('ping');
const ping2 = require('ping-tcp-js')

let stats = {
    node1: {
        serverID: '7c740e8c',
        IP: '154.27.68.105'
    },
    node2: {
        serverID: '4bbbdb0d',
        IP: '154.27.68.106'
    },
    node3: {
        serverID: '57622dc8',
        IP: '167.86.113.158'
    },
    node4: {
        serverID: '98ca4dbd',
        IP: '51.38.69.73'
    },
    node5: {
        serverID: '6d83e569',
        IP: '154.27.68.108'
    },
    node6: {
        serverID: '8565f2e0',
        IP: '194.146.44.170'
    },
    node7: {
        serverID: '94082df3',
        IP: '154.27.68.110'
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

            axios({
                url: 'http://' + data.IP + ':999/random',
                timeout: 1500,
            }).then(x => {

            }).catch(x => {

                if (x.response != null) {
                    nodeStatus.set(node, {
                        status: false,
                        is_vm_online: true
                    });
                } else {
                    nodeStatus.set(node, {
                        status: false,
                        is_vm_online: false
                    });
                }
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
            status: true
        });
    }).catch(error => {
        nodeStatus.set("node1-priv", {
            status: false
        });
    })

    //Node 1 (PUBLIC GAMESERVER PANEL)
    /*
    axios({
        url: config.PubPterodactyl.hosturl + "/api/client/servers/e8766671/resources",
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.PubPterodactyl.apikeyclient,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        }
    }).then(response => {
        nodeStatus.set("pub_node1", {
            status: true
        });
    }).catch(error => {
        nodeStatus.set("pub_node1", {
            status: false
        });
    })
    *\
     */

    // Panel Cherckers
    var hosts = ['154.27.68.95', 'panel.danbot.host', 'mail.danbot.host', 'api.danbot.host', 'admin.danbot.host', 'pub.danbot.host'];
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

    //Panel load balancer status
    ping2.ping('161.97.138.124', 80)
        .then(() => nodeStatus.set("paneleu", {
            status: true
        }))
        .catch((e) => nodeStatus.set("paneleu", {
            status: false
        }));
    ping2.ping('34.74.102.235', 2333)
        .then(() => nodeStatus.set("panelus", {
            status: true
        }))
        .catch((e) => nodeStatus.set("panelus", {
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