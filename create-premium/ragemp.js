createListPrem.ragemp = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 44,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_debian",
    "startup": `./server`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_NAME": "RAGE:MP Unofficial server",
        "MAX_PLAYERS": "50",
        "ANNOUNCE": "0"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 2,
        "backups": 10
    },
    "deploy": {
        "locations": gamingPREM,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
