createList.bedrock = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 18,
    docker_image: "ghcr.io/parkervcp/yolks:debian",
    startup: "./bedrock_server",
    limits: {
        memory: 2048,
        swap: -1,
        disk: 10240,
        io: 500,
        cpu: 100,
    },
    environment: {
        BEDROCK_VERSION: "latest",
        LD_LIBRARY_PATH: ".",
        SERVERNAME: "Bedrock Dedicated Server",
        GAMEMODE: "survival",
        DIFFICULTY: "easy",
        CHEATS: "false",
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
