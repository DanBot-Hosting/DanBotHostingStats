createList.openx = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 17,
    egg: 79,
    docker_image: "quay.io/parkervcp/pterodactyl-images:debian_nodejs-16",
    startup:
        "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; /usr/local/bin/node /home/container/Src/index.js",
    limits: {
        memory: 0,
        swap: -1,
        disk: 10240,
        io: 500,
        cpu: 0,
    },
    environment: {
        FILELENGTH: "8",
        PASSWORD: getPassword(),
        MAXUPLOAD: "1024",
        AUTO_UPDATE: 0
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
    oom_disabled: false,
});
