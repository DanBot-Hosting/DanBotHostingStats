createListPrem.arkse = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 2,
    "egg": 6,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": `"cd ShooterGame/Binaries/Linux && ./ShooterGameServer {{SERVER_MAP}}?listen?SessionName='{{SESSION_NAME}}'?ServerPassword={{ARK_PASSWORD}}?ServerAdminPassword={{ARK_ADMIN_PASSWORD}}?Port={{PORT}}?MaxPlayers={{SERVER_MAX_PLAYERS}}?RCONPort={{RCON_PORT}}?QueryPort={{QUERY_PORT}}?RCONEnabled={{ENABLE_RCON}} -server -log"`,
    "limits": {
        "memory": 2048,
        "swap": -1,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "ARK_PASSWORD": null,
        "ARK_ADMIN_PASSWORD": null,
        "SERVER_MAX_PLAYERS": "20",
        "SERVER_MAP": "TheIsland",
        "SESSION_NAME": "ARK SERVER",
        "PORT": "7777",
        "ENABLE_RCON": "false",
        "RCON_PORT": "27020",
        "QUERY_PORT": "27015",
        "SRCDS_APPID": "376030"
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
