createListPrem.altv = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 42,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_dotnet",
    "startup": `sleep 2 && ./altv-server`,
    "limits": {
        "memory": 2048,
        "swap": -1,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "LD_LIBRARY_PATH": ".",
        "BUILD": "release",
        "PASSWORD": "changeme",
        "FIVEM_VERSION": "latest",
        "SERVER_DESC": "A alt:v server hosted for free by DanBot Hosting!"
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
