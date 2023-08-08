createListPrem.nginx = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 14,
    egg: 48,
    docker_image: "registry.gitlab.com/tenten8401/pterodactyl-nginx",
    startup: `{{STARTUP_CMD}}`,
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        STARTUP_CMD: "./start.sh",
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
