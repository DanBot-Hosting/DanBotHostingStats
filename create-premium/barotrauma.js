module.exports = {
    isGameServer: true,
    isDisabled: true,
    subCategory: "SteamCMD",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 4,
        egg: 56,
        docker_image: "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
        startup: "./DedicatedServer -batchmode",
        limits: {
            memory: 6144,
            swap: -1,
            disk: 0,
            io: 500,
            cpu: 0,
        },
        environment: {},
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