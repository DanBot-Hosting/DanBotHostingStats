module.exports = {
    isGameServer: true,
    isDisabled: true,
    subCategory: "Grand Theft Auto",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 9,
        egg: 42,
        docker_image: "ghcr.io/parkervcp/games:altv",
        startup: `./altv-server`,
        limits: {
            memory: 6144,
            swap: -1,
            disk: 0,
            io: 500,
            cpu: 0,
        },
        environment: {
            LD_LIBRARY_PATH: ".",
            BUILD: "release",
            PASSWORD: "changeme",
            SERVER_DESC: "A alt:v server hosted for free by DanBot Hosting!",
        },
        feature_limits: {
            databases: 2,
            allocations: 5,
            backups: 10,
        },
        deploy: {
            locations: gamingPREM,
            dedicated_ip: false,
            port_range: [],
        },
        start_on_completion: false,
        oom_disabled: false,
    };
};
