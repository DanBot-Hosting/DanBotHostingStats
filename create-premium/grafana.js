createListPrem.grafana = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 19,
    egg: 73,
    docker_image: "ghcr.io/parkervcp/yolks:debian",
    startup: "./bin/grafana-server web",
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        GRAFANA_VERSION: "latest",
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
