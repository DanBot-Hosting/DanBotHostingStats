module.exports = {
    isGameServer: true,
    isDisabled: true,
    subCategory: "Minecraft",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 1,
        egg: 57,
        docker_image: "quay.io/pterodactyl/core:java-11\n",
        startup:
            "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}",
        limits: {
            memory: 6144,
            swap: -1,
            disk: 0,
            io: 500,
            cpu: 0,
        },
        environment: {
            MINECRAFT_VERSION: "latest",
            SERVER_JARFILE: "waterfall.jar",
            DL_LINK: null,
            BUILD_NUMBER: "latest",
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
    }
};