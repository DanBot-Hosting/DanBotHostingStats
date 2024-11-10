createListPrem.nukkit = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 87,
    docker_image: "ghcr.io/pterodactyl/yolks:java_17",
    startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    limits: {
        memory: 6144,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        SERVER_JARFILE: "server.jar",
        NUKKIT_VERSION: "latest",
    },
    feature_limits: {
        databases: 2,
        allocations: 5,
        backups: 10,
    },
    deploy: {
        locations: gamingPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
    oom_disabled: false,
});
