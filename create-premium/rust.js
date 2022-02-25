createListPrem.rust = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 14,
    "docker_image": "quay.io/pterodactyl/core:rust",
    "startup": `./RustDedicated -batchmode +server.port {{SERVER_PORT}} +server.identity "rust" +rcon.port {{RCON_PORT}} +rcon.web true +server.hostname \"{{HOSTNAME}}\" +server.level \"{{LEVEL}}\" +server.description \"{{DESCRIPTION}}\" +server.url \"{{SERVER_URL}}\" +server.headerimage \"{{SERVER_IMG}}\" +server.worldsize \"{{WORLD_SIZE}}\" +server.seed \"{{WORLD_SEED}}\" +server.maxplayers {{MAX_PLAYERS}} +rcon.password \"{{RCON_PASS}}\" +server.saveinterval {{SAVEINTERVAL}} {{ADDITIONAL_ARGS}}`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "HOSTNAME": "A Rust Server",
        "OXIDE": "0",
        "LEVEL": "20",
        "SERVER_MAP": "Procedural Map",
        "DESCRIPTION": "Powered by DanBot Hosting - Free Hosting, Forever",
        "SERVER_URL": "https://danbot.host",
        "WORLD_SIZE": "3000",
        "WORLD_SEED": null,
        "MAX_PLAYERS": "40",
        "SERVER_IMG": null,
        "RCON_PORT": "28016",
        "RCON_PASS": "DBHisthebest",
        "SAVEINTERVAL": "60",
        "ADDITIONAL_ARGS": null
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
