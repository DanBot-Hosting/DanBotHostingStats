createListPrem.daystodie = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 52,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": './7DaysToDieServer.x86_64 -configfile=serverconfig.xml -quit -batchmode -nographics -dedicated -ServerPort=${SERVER_PORT} -ServerMaxPlayerCount=${MAX_PLAYERS} -GameDifficulty=${GAME_DIFFICULTY} -ControlPanelEnabled=false -TelnetEnabled=true -TelnetPort=8081 -logfile logs/latest.log & echo -e "Checing on telnet connection" && until nc -z -v -w5 127.0.0.1 8081; do echo "Waiting for telnet connection..."; sleep 5; done && telnet -E 127.0.0.1 8081',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MAX_PLAYERS": "8",
        "GAME_DIFFICULTY": "2",
        "SRCDS_APPID": "294420",
        "AUTO_UPDATE": "1",
        "LD_LIBRARY_PATH": "."
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
