createListPrem.storage = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 5,
    egg: 46,
    docker_image: "danielpmc/discordnode8",
    startup: "${STARTUP_CMD}",
    limits: {
        memory: 1,
        swap: -1,
        disk: 1048576,
        io: 500,
        cpu: 1,
    },
    environment: {
        STARTUP_CMD: "STORAGE NODE",
    },
    feature_limits: {
        databases: 0,
        allocations: 1,
        backups: 0,
    },
    deploy: {
        locations: storagePREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
});
