module.exports = {
    isGameServer: false,
    isDisabled: false,
    subCategory: "Software",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 19,
        egg: 68,
        docker_image: "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
        startup: `npm start`,
        limits: {
            memory: 0,
            swap: -1,
            disk: 10240,
            io: 500,
            cpu: 0,
        },
        environment: {},
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
    };
};