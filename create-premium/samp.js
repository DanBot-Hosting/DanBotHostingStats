createListPrem.samp = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 45,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:game_samp",
    "startup": `./samp03svr`,
    "limits": {
        "memory": 4096,
        "swap": -1,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "environment": {},
    "deploy": {
        "locations": gamingPREM,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
