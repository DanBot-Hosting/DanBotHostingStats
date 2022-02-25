createList.python = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 22,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_python-3.8",
    "startup": "${STARTUP_CMD}",
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STARTUP_CMD": "bash"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdbFREE,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
})
