createListPrem.ts3 = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 3,
    "egg": 13,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_debian",
    "startup": `./ts3server default_voice_port={{SERVER_PORT}} query_port={{SERVER_PORT}} filetransfer_ip=0.0.0.0 filetransfer_port={{FILE_TRANSFER}} license_accepted=1`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "TS_VERSION": "latest",
        "FILE_TRANSFER": "30033",
        "QUERY_PORT": "10011"
    },
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
