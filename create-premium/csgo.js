createListPrem.csgo = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 2,
    "egg": 7,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": "./srcds_run -game csgo -console -port {{SERVER_PORT}} +ip 0.0.0.0 +map {{SRCDS_MAP}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SRCDS_MAP": "de_dust2",
        "STEAM_ACC": "BD1868C7DFC242D39EBE2062B10C6A3A",
        "SRCDS_APPID": "740"
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
