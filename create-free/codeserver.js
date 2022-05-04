createList.codeserver = (serverName, userID) => ({
        "name": serverName,
        "user": userID,
        "nest": 19,
        "egg": 66,
        "docker_image": "ghcr.io/parkervcp/yolks:nodejs_17",
        "startup": `sh .local/lib/code-server-{{VERSION}}/bin/code-server`,
        "limits": {
            "memory": 0,
            "swap": -1,
            "disk": 10240,
            "io": 500,
            "cpu": 0
        },
        "environment": {
            "PASSWORD": getPassword(),
            "VERSION": "latest"
        },
        "feature_limits": {
            "databases": 2,
            "allocations": 1,
            "backups": 10
        },
        "deploy": {
            "locations": botswebdbFREE,
            "dedicated_ip": false,
            "port_range": []
        },
        "start_on_completion": false
    });

