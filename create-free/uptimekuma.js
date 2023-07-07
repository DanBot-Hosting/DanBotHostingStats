createList.uptimekuma = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 19,
    "egg": 70,
    "docker_image": "ghcr.io/parkervcp/yolks:nodejs_16",
    "startup": `if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/node /home/container/{{JS_FILE}} --port={{SERVER_PORT}}`,
    "limits": {
        "memory": 0,
        "swap": -1,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
      "GIT_ADDRESS": "https://github.com/louislam/uptime-kuma",
      "AUTO_UPDATE": "1",
      "JS_FILE": "server/server.js"
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