createList.rustc = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 71,
    "docker_image": "ghcr.io/parkervcp/yolks:rust_latest",
    "startup": "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; cargo run --release",
    "limits": {
        "memory": 0,
        "swap": -1,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "AUTO_UPDATE": "1"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": [botswebdbFREE],
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
});
