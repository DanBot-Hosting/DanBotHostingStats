createListPrem.scpsl = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 4,
    egg: 89,
    docker_image: "ghcr.io/parkervcp/yolks:mono_latest",
    startup: "./LocalAdmin {{SERVER_PORT}}",
    limits: {
        memory: 6144,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        SRCDS_APPID: "996560",
        DOTNET_BUNDLE_EXTRACT_BASE_DIR: "./dotnet-bundle",
        AUTO_UPDATE: 1
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: gamingPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
    oom_disabled: false,
});