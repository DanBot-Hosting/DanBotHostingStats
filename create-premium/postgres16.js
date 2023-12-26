createListPrem.postgres16 = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 12,
    egg: 80,
    docker_image: "ghcr.io/parkervcp/yolks:postgres_16",
    startup: `postgres  -D /home/container/postgres_db/`,
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        PGPASSWORD: getPassword(),
        PGUSER: "pterodactyl",
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
    oom_disabled: false,
});
