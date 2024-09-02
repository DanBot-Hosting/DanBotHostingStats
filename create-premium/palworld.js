const generatePassword = require('../src/util/generatePassword.js');

createListPrem.palworld = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 4,
    egg: 86,
    docker_image: "ghcr.io/parkervcp/steamcmd:debian",
    startup: `/home/container/Pal/Binaries/Linux/PalServer-Linux-Test Pal -port={{SERVER_PORT}} -players={{MAX_PLAYERS}} -useperfthreads -NoAsyncLoadingThread -UseMultithreadForDS -publicip={{PUBLIC_IP}} -publicport={{SERVER_PORT}} EpicApp=PalServer -servername="{{SRV_NAME}}" -serverpassword="{{SRV_PASSWORD}}" -adminpassword="{{ADMIN_PASSWORD}}"`,
    limits: {
        memory: 6144,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    environment: {
        SRCDS_APPID: "2394010",
        AUTO_UPDATE: 1,
        MAX_PLAYERS: 32,
        SRV_NAME: "A Palword Server hosted on DanBot Hosting LTD",
        SRV_PASSWORD: generatePassword(),
        ADMIN_PASSWORD: generatePassword(),
        PUBLIC_IP: "128.254.225.78",
    },
    deploy: {
        locations: gamingPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
    oom_disabled: false,
});
