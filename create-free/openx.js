const generatePassword = require('../src/util/generatePassword.js');

module.exports = {
    isGameServer: false,
    isDisabled: false,
    subCategory: "Software",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 17,
        egg: 79,
        docker_image: "quay.io/parkervcp/pterodactyl-images:debian_nodejs-16",
        startup:
            'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; /usr/local/bin/node /home/container/Src/index.js',
        limits: {
            memory: 1024,
            swap: -1,
            disk: 5120,
            io: 500,
            cpu: 100,
        },
        environment: {
            FILELENGTH: "8",
            PASSWORD: generatePassword(),
            MAXUPLOAD: "1024",
            AUTO_UPDATE: 0,
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
    };
};
