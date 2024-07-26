createList.rabbitmq = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 19,
    egg: 85,
    docker_image: "ghcr.io/parkervcp/yolks:erlang_26",
    startup: "./sbin/rabbitmq-server",
    limits: {
        memory: 0,
        swap: -1,
        disk: 10240,
        io: 500,
        cpu: 0,
    },
    environment: {
        RABBITMQ_VERSION: "latest",
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: botswebdbFREE,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
});
