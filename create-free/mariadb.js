createList.mariadb = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 12,
    egg: 69,
    docker_image: "quay.io/parkervcp/pterodactyl-images:db_mariadb",
    startup: `{ /usr/sbin/mysqld & } && sleep 5 && mysql -u root`,
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
    oom_disabled: false,
});
