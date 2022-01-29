createListPrem.sharex = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 17,
    "egg": 62,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
    "startup": `/usr/local/bin/node /home/container/src/index.js`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {},
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdbPrem,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
