createListPrem.gitea = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 19,
    "egg": 67,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_debian",
    "startup": `./gitea web -p {{SERVER_PORT}} -c ./app.ini`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "DISABLE_SSH": "true",
        "SSH_PORT": "2020"
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
    "start_on_completion": false
});
