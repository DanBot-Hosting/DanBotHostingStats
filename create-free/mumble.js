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
        egg: 12,
        docker_image: "ghcr.io/parkervcp/yolks:voice_mumble",
        startup: `mumble-server -fg -ini murmur.ini`,
        limits: {
            memory: 1024,
            swap: -1,
            disk: 5120,
            io: 500,
            cpu: 100,
        },
        environment: {
            MAX_USERS: "100",
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