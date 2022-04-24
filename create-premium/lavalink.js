createListPrem.lavalink = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 3,
    "egg": 59,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_openjdk-13",
    "startup": `java -jar Lavalink.jar`,
    "limits": {
        "memory": 1024,
        "swap": 0,
        "disk": 0,
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
        "locations": botswebdbPREM,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
