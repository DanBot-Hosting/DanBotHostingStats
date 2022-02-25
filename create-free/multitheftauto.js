createList.multitheftauto = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 43,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": `./mta-server64 --port {{SERVER_PORT}} --httpport {{SERVER_WEBPORT}} -n`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_WEBPORT": "22005"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gamingFREE,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
