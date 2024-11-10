createListPrem.java = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 5,
    egg: 25,
    docker_image: "ghcr.io/parkervcp/yolks:java_17",
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
        allocations: 5,
        backups: 10,
    },
    deploy: {
        locations: botswebdbPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
});
