module.exports = {
    isGameServer: false,
    isDisabled: false,
    subCategory: "Storage",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 22,
        egg: 92,
        docker_image: "ghcr.io/parkervcp/yolks:alpine",
        startup: `echo -e "\n\nThere is no need to start this server. The SFTP service is always running. Feel free to stop the server now.\n\t(Sub-users can be added via the Users tab to add/remove access to the share in real time)\n\n"`,
        limits: {
            memory: 1024,
            swap: -1,
            disk: 5120,
            io: 500,
            cpu: 100,
        },
        environment: {},
        feature_limits: {
            databases: 0,
            allocations: 1,
            backups: 0,
        },
        deploy: {
            locations: storageFREE,
            dedicated_ip: false,
            port_range: [],
        },
        start_on_completion: false,
    };
};
