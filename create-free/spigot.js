createList.spigot = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 58,
    docker_image: "ghcr.io/pterodactyl/yolks:java_17",
    startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    limits: {
        memory: 2048,
        swap: -1,
        disk: 10240,
        io: 500,
        cpu: 0,
    },
    environment: {
        SERVER_JARFILE: "server.jar",
        DL_PATH: null,
        DL_VERSION: "latest",
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: gamingFREE,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
    oom_disabled: false,
});
