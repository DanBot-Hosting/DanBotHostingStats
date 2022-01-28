createList.gmod = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 2,
    "egg": 9,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": "./srcds_run -game garrysmod -console -port {{SERVER_PORT}} +ip 0.0.0.0 +host_workshop_collection {{WORKSHOP_ID}} +map {{SRCDS_MAP}} +gamemode {{GAMEMODE}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}} +maxplayers {{MAX_PLAYERS}}  -tickrate {{TICKRATE}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SRCDS_MAP": "gm_flatgrass",
        "STEAM_ACC": null,
        "SRCDS_APPID": "4020",
        "WORKSHOP_ID": null,
        "GAMEMODE": "sandbox",
        "MAX_PLAYERS": "32",
        "TICKRATE": "22"
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
