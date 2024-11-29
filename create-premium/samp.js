const generatePassword = require('../src/util/generatePassword.js');

module.exports = {
    isGameServer: true,
    isDisabled: true,
    subCategory: "Grand Theft Auto",
    createServer: createServer
}

function createServer(ServerName, UserID){
    return {
        name: ServerName,
        user: UserID,
        nest: 9,
        egg: 94,
        docker_image: "ghcr.io/parkervcp/games:samp",
        startup: `./omp-server`,
        limits: {
            memory: 6144,
            swap: -1,
            disk: 0,
            io: 500,
            cpu: 0,
        },
        feature_limits: {
            databases: 2,
            allocations: 5,
            backups: 10,
        },
        environment: {
            RCON_PASSWORD: generatePassword(),
            VERSION: "latest",
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