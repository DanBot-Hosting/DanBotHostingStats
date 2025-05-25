module.exports = {
    isGameServer: false,
    isDisabled: true,
    subCategory: "Voice Servers",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 3,
        egg: 13,
        docker_image: "quay.io/parkervcp/pterodactyl-images:base_debian",
        startup: `./ts3server default_voice_port={{SERVER_PORT}} query_port={{SERVER_PORT}} filetransfer_ip=0.0.0.0 filetransfer_port={{FILE_TRANSFER}} license_accepted=1`,
        limits: {
            memory: 1024,
            swap: -1,
            disk: 5120,
            io: 500,
            cpu: 100,
        },
        environment: {
            TS_VERSION: "latest",
            FILE_TRANSFER: "30033",
            QUERY_PORT: "10011",
            QUERY_PROTOCOLS_VAR: "raw,http,ssh",
            QUERY_SSH: "10022",
            QUERY_HTTP: "10080",
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
        oom_disabled: false,
    };
};