const Config = require('../config.json');

const Status = {
        Nodes: {
            "Performance Nodes": {
                pnode1: {
                    Name: "PNode 1",
                    serverID: "7e99f988",
                    IP: Config.Nodes.PNode1,
                    ID: "38",
                    Location: Config.Ping.UK
                },
                pnode2: {
                    Name: "PNode 2",
                    serverID: "2358ca8e",
                    IP: Config.Nodes.PNode2,
                    ID: "40",
                    Location: Config.Ping.UK
                },
                pnode3: {
                    Name: "PNode 3",
                    serverID: "150791a9",
                    IP: Config.Nodes.PNode3,
                    ID: "43",
                    Location: Config.Ping.UK
                }
            },

            "Donator Nodes": {
                dono01: {
                    Name: "Dono-01",
                    serverID: "bd9d3ad6",
                    IP: Config.Nodes.Dono1,
                    ID: "34",
                    Location: Config.Ping.UK
                },
                dono02: {
                    Name: "Dono-02",
                    serverID: "ca6dba5a",
                    IP: Config.Nodes.Dono2,
                    ID: "31",
                    Location: Config.Ping.UK
                },
                dono03: {
                    Name: "Dono-03",
                    serverID: "c23f92cb",
                    IP: Config.Nodes.Dono3,
                    ID: "33",
                    Location: Config.Ping.UK
                },
                dono04: {
                    Name: "Dono-04",
                    serverID: "c095a2cb",
                    IP: Config.Nodes.Dono4,
                    ID: "46",
                    Location: Config.Ping.UK
                }
            },
    
            "Storage Nodes": {
                storage1: {
                    Name: "Storage-1",
                    serverID: "ed33bb0c",
                    IP: Config.Nodes.Storage1,
                    ID: "44",
                    Location: Config.Ping.UK
                }
            }
        },

        "Dedicated Servers (VPS/VM Hosts)": {
            us1: {
                name: "United States 1",
                IP: Config.Servers.US1,
                Location: Config.Ping.UK
            },
            us2: {
                name: "United States 2",
                IP: Config.Servers.US2,
                Location: Config.Ping.UK
            },
            eu1: {
                name: "Europe 1",
                IP: Config.Servers.EU1,
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