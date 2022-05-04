createListPrem.bedrock = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 18,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_ubuntu",
    "startup": "./bedrock_server",
    "limits": {
        "memory": 2048,
        "swap": -1,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "BEDROCK_VERSION": "latest",
        "LD_LIBRARY_PATH": "."
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
