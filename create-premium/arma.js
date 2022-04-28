createListPrem.arma = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 53,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:game_arma3",
    "startup": './{{SERVER_BINARY}} -ip=0.0.0.0 -port={{SERVER_PORT}} -profiles=./serverprofile -bepath=./battleye -cfg=\\"{{BASIC}}\\" -config=\\"{{CONFIG}}\\" -mod=\\"{{MODIFICATIONS}}\\" -serverMod=\\"{{SERVERMODS}}\\" {{STARTUP_PARAMS}}',
    "limits": {
        "memory": 2048,
        "swap": -1,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STEAMCMD_APPID": "233780",
        "STEAM_USER": "your_steam_username",
        "STEAM_PASS": "your_steam_password",
        "SERVER_BINARY": "arma3server_x64",
        "STARTUP_PARAMS": "-noLogs",
        "CONFIG": "server.cfg",
        "BASIC": "basic.cfg",
        "MODIFICATIONS": null,
        "SERVERMODS": null,
        "UPDATE_SERVER": 0,
        "UPDATE_WORKSHOP": null,
        "MODS_LOWERCASE": 0,
        "STEAMCMD_EXTRA_FLAGS": null,
        "HC_NUM": "0",
        "HC_PASSWORD": null,
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
