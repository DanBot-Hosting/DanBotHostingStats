createListPrem.forge = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 2,
    "docker_image": "quay.io/pterodactyl/core:java",
    "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_JARFILE": "server.jar",
        "MC_VERSION": "latest",
        "BUILD_TYPE": "recommended",
        "FORGE_VERSION": "1.16.3"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
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
