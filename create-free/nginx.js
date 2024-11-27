module.exports = {
    isGameServer: false,
    isDisabled: false,
    subCategory: "Web Hosting",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 14,
        egg: 48,
        docker_image: "danbothosting/nginx",
        startup: `{{STARTUP_CMD}}`,
        limits: {
            memory: 0,
            swap: -1,
            disk: 10240,
            io: 500,
            cpu: 0,
        },
        environment: {
            STARTUP_CMD: "./start.sh",
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
    };
};