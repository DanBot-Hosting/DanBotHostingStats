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
        egg: 2,
        docker_image: "ghcr.io/pterodactyl/yolks:java_18",
        startup: `java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true $( [[  ! -f unix_args.txt ]] && printf %s "-jar {{SERVER_JARFILE}}" || printf %s "@unix_args.txt" )`,
        limits: {
            memory: 6144,
            swap: -1,
            disk: 0,
            io: 500,
            cpu: 0,
        },
        environment: {
            SERVER_JARFILE: "server.jar",
            MC_VERSION: "latest",
            BUILD_TYPE: "recommended",
            FORGE_VERSION: null,
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
