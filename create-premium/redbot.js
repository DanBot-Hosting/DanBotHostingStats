createListPrem.redbot = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 5,
    egg: 72,
    docker_image: "ghcr.io/parkervcp/yolks:bot_red",
    startup: "PATH=$PATH:/home/container/.local/bin redbot pterodactyl --token {{TOKEN}} --prefix {{PREFIX}}",
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        TOKEN: "FILL_THIS_OUT",
        PREFIX: "FILL_THIS_OUT",
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
