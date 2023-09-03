createListPrem.aio = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 5,
    egg: 46,
    docker_image: "danbothosting/aio",
    startup: "${STARTUP_CMD}",
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        STARTUP_CMD: "bash",
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: botswebdbPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
});
