module.exports = {
    isGameServer: false,
    isDisabled: false,
    subCategory: "Bots",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 5,
        egg: 72,
        docker_image: "ghcr.io/parkervcp/yolks:bot_red",
        startup:
            "PATH=$PATH:/home/container/.local/bin redbot pterodactyl --token {{TOKEN}} --prefix {{PREFIX}}",
        limits: {
            memory: 1024,
            swap: -1,
            disk: 5120,
            io: 500,
            cpu: 100,
        },
        environment: {
            TOKEN: "FILL_THIS_OUT",
            PREFIX: "FILL_THIS_OUT",
            OWNER: "FILL_THIS_OUT",
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