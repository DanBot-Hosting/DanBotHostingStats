createList.pocketminemp = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 28,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_ubuntu",
    "startup": "./bin/php7/bin/php ./PocketMine-MP.phar --no-wizard --disable-ansi",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "PMMP_VERSION": "latest"
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
