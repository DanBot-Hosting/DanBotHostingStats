createList.terraria = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 12,
    "egg": 40,
    "docker_image": "ghcr.io/parkervcp/yolks:debian",
    "startup": "./TerrariaServer.bin.x86_64 -config serverconfig.txt",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MAX_PLAYERS": 8,
        "WORLD_SIZE": 1,
        "WORLD_DIFFICULTY": 3,
        "TERRARIA_VERSION": "latest",
        "WORLD_NAME": "world",
        "SERVER_MOTD": "Hosted by DBH"
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
});