createListPrem.influxdb = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 12,
    egg: 93,
    docker_image: "ghcr.io/parkervcp/yolks:debian",
    startup: `./influxd  --http-bind-address 0.0.0.0:{{SERVER_PORT}}`,
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        VERSION: "v2.4",
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
