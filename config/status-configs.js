const Config = require('../config.json');

const Status = {
        Nodes: {
            "Performance Nodes": {
                pnode1: {
                    Name: "PNode 1",
                    serverID: "2dadcc36",
                    IP: Config.Nodes.PNode1,
                    ID: "38",
                    Location: Config.Ping.UK,
                    MaxLimit: 1000
                },
                pnode2: {
                    Name: "PNode 2",
                    serverID: "2358ca8e",
                    IP: Config.Nodes.PNode2,
                    ID: "40",
                    Location: Config.Ping.UK,
                    MaxLimit: 7000
                },
                pnode3: {
                    Name: "PNode 3",
                    serverID: "150791a9",
                    IP: Config.Nodes.PNode3,
                    ID: "43",
                    Location: Config.Ping.UK,
                    MaxLimit: 8000
                }
            },

            "Donator Nodes": {
                dono01: {
                    Name: "Dono-01",
                    serverID: "bd9d3ad6",
                    IP: Config.Nodes.Dono1,
                    ID: "34",
                    Location: Config.Ping.UK,
                    MaxLimit: 1500
                },
                dono02: {
                    Name: "Dono-02",
                    serverID: "ca6dba5a",
                    IP: Config.Nodes.Dono2,
                    ID: "31",
                    Location: Config.Ping.UK,
                    MaxLimit: 560
                },
                dono03: {
                    Name: "Dono-03",
                    serverID: "c23f92cb",
                    IP: Config.Nodes.Dono3,
                    ID: "33",
                    Location: Config.Ping.UK,
                    MaxLimit: 2000
                },
                dono04: {
                    Name: "Dono-04",
                    serverID: "c095a2cb",
                    IP: Config.Nodes.Dono4,
                    ID: "46",
                    Location: Config.Ping.UK,
                    MaxLimit: 200
                },
                dono05: {
                    Name: "Dono-05",
                    serverID: "1ba2236c",
                    IP: Config.Nodes.Dono5,
                    ID: "47",
                    Location: Config.Ping.UK,
                    MaxLimit: 2000
                }
            },
    
            "Storage Nodes": {
                storage1: {
                    Name: "Storage-1",
                    serverID: "ed33bb0c",
                    IP: Config.Nodes.Storage1,
                    ID: "44",
                    Location: Config.Ping.UK,
                    MaxLimit: 1000
                    
                }
            }
        },

        "Dedicated Servers (VPS/VM Hosts)": {
            us1: {
                name: "United States 1",
                IP: Config.Servers.US1,
                Location: Config.Ping.UK
            }
        },

        "DBH Services": {
            pterodactylPublic: {
                name: "Pterodactyl (Public)",
                IP: Config.Services.pteropublic,
                Location: Config.Ping.UK
            }
        }
}

module.exports = Status;
