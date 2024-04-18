createList.storage = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 22,
    egg: 92,
    docker_image: "ghcr.io/parkervcp/yolks:alpine",
    startup: "${STARTUP_CMD}",
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        STARTUP_CMD: `echo -e "\n\n\033[0;31mThere is no need to start this server. The SFTP service is always running. Feel free to stop the server now.\n\t\033[0;36m(Sub-users can be added via the Users tab to add/remove access to the share in real time)\n\n"`,
    },
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
});
