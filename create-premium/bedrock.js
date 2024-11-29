module.exports = {
    isGameServer: true,
    isDisabled: false,
    subCategory: "Minecraft",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 1,
        egg: 18,
        docker_image: "ghcr.io/parkervcp/yolks:debian",
        startup: "./bedrock_server",
        limits: {
            memory: 6144,
            swap: -1,
            disk: 0,
            io: 500,
            cpu: 0,
        },
        environment: {
            BEDROCK_VERSION: "latest",
            LD_LIBRARY_PATH: ".",
            SERVERNAME: "Bedrock Dedicated Server",
            GAMEMODE: "survival",
            DIFFICULTY: "easy",
            CHEATS: "false",
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
        oom_disabled: false
    };
};
