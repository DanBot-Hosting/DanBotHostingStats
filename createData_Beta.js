const axios = require('axios');

const CAPSNUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12341467890';

var getPassword = () => {
    var password = '';
    while (password.length < 14) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

const list = {};

list.paper = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 3,
    docker_image: 'quay.io/pterodactyl/core:java',
    startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}',
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        MINECRAFT_VERSION: 'latest',
        SERVER_JARFILE: 'server.jar',
        DL_PATH: 'https://papermc.io/api/v2/projects/paper/versions/1.16.4/builds/408/downloads/paper-1.16.4-408.jar',
        BUILD_NUMBER: 'latest'
    },
    feature_limits: {
        databases: 0,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.forge = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 2,
    docker_image: 'quay.io/pterodactyl/core:java',
    startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        SERVER_JARFILE: 'server.jar',
        MC_VERSION: 'latest',
        BUILD_TYPE: 'recommended',
        FORGE_VERSION: '1.16.3'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.fivem = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 9,
    egg: 26,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:base_alpine',
    startup: `$(pwd)/alpine/opt/cfx-server/ld-musl-x86_64.so.1 --library-path "$(pwd)/alpine/usr/lib/v8/:$(pwd)/alpine/lib/:$(pwd)/alpine/usr/lib/" -- $(pwd)/alpine/opt/cfx-server/FXServer +set citizen_dir $(pwd)/alpine/opt/cfx-server/citizen/ +set sv_licenseKey {{FIVEM_LICENSE}} +set steam_webApiKey {{STEAM_WEBAPIKEY}} +set sv_maxplayers {{MAX_PLAYERS}} +set serverProfile default +set txAdminPort {{TXADMIN_PORT}} $( [ "$TXADMIN_ENABLE" == "1" ] || printf %s '+exec server.cfg' )`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        FIVEM_LICENSE: '6pc7xbhxoep0ms5m5rsg09k11plzib6w',
        MAX_PLAYERS: '32',
        SERVER_HOSTNAME: 'My new FXServer!',
        FIVEM_VERSION: 'latest',
        DOWNLOAD_URL: null,
        STEAM_WEBAPIKEY: 'none',
        TXADMIN_PORT: '40120',
        TXADMIN_ENABLE: '0'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.altv = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 9,
    egg: 42,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:debian_dotnet',
    startup: `sleep 2 && ./altv-server`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        LD_LIBRARY_PATH: '.',
        BUILD: 'release',
        PASSWORD: 'changeme',
        FIVEM_VERSION: 'latest',
        SERVER_DESC: 'A alt:v server hosted for free by DanBot Hosting!'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.multitheftauto = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 9,
    egg: 43,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:ubuntu_source',
    startup: `./mta-server64 --port {{SERVER_PORT}} --httpport {{SERVER_WEBPORT}} -n`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        SERVER_WEBPORT: '22005'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.ragemp = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 9,
    egg: 44,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:base_debian',
    startup: `./server`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        SERVER_NAME: 'RAGE:MP Unofficial server',
        MAX_PLAYERS: '50',
        ANNOUNCE: '0'
    },
    feature_limits: {
        databases: 2,
        allocations: 2,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.samp = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 9,
    egg: 45,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:game_samp',
    startup: `./samp03svr`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    environment: {},
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.bedrock = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 18,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:base_ubuntu',
    startup: './bedrock_server',
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        BEDROCK_VERSION: 'latest',
        LD_LIBRARY_PATH: '.'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.pocketminemp = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 28,
    docker_image: 'quay.io/parkervcp/pterodactyl-images:base_ubuntu',
    startup: './bin/php7/bin/php ./PocketMine-MP.phar --no-wizard --disable-ansi',
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        PMMP_VERSION: 'latest'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.gmod = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 2,
    egg: 9,
    docker_image: 'quay.io/pterodactyl/core:source',
    startup: './srcds_run -game garrysmod -console -port {{SERVER_PORT}} +ip 0.0.0.0 +host_workshop_collection {{WORKSHOP_ID}} +map {{SRCDS_MAP}} +gamemode {{GAMEMODE}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}} +maxplayers {{MAX_PLAYERS}}  -tickrate {{TICKRATE}}',
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        SRCDS_MAP: 'gm_flatgrass',
        STEAM_ACC: null,
        SRCDS_APPID: '4020',
        WORKSHOP_ID: null,
        GAMEMODE: 'sandbox',
        MAX_PLAYERS: '32',
        TICKRATE: '22'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.csgo = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 2,
    egg: 7,
    docker_image: 'quay.io/pterodactyl/core:source',
    startup: './srcds_run -game csgo -console -port {{SERVER_PORT}} +ip 0.0.0.0 +map {{SRCDS_MAP}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}}',
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        SRCDS_MAP: 'de_dust2',
        STEAM_ACC: 'BD1868C7DFC242D39EBE2062B10C6A3A',
        SRCDS_APPID: '740'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.arkse = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 2,
    egg: 6,
    docker_image: 'quay.io/pterodactyl/core:source',
    startup: `"cd ShooterGame/Binaries/Linux && ./ShooterGameServer {{SERVER_MAP}}?listen?SessionName='{{SESSION_NAME}}'?ServerPassword={{ARK_PASSWORD}}?ServerAdminPassword={{ARK_ADMIN_PASSWORD}}?Port={{PORT}}?MaxPlayers={{SERVER_MAX_PLAYERS}}?RCONPort={{RCON_PORT}}?QueryPort={{QUERY_PORT}}?RCONEnabled={{ENABLE_RCON}} -server -log"`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        ARK_PASSWORD: null,
        ARK_ADMIN_PASSWORD: null,
        SERVER_MAX_PLAYERS: '20',
        SERVER_MAP: 'TheIsland',
        SESSION_NAME: 'ARK SERVER',
        PORT: '7777',
        ENABLE_RCON: 'false',
        RCON_PORT: '27020',
        QUERY_PORT: '27015',
        SRCDS_APPID: '376030'
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

list.rust = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 4,
    egg: 14,
    docker_image: 'quay.io/pterodactyl/core:rust',
    startup: `./RustDedicated -batchmode +server.port {{SERVER_PORT}} +server.identity "rust" +rcon.port {{RCON_PORT}} +rcon.web true +server.hostname \"{{HOSTNAME}}\" +server.level \"{{LEVEL}}\" +server.description \"{{DESCRIPTION}}\" +server.url \"{{SERVER_URL}}\" +server.headerimage \"{{SERVER_IMG}}\" +server.worldsize \"{{WORLD_SIZE}}\" +server.seed \"{{WORLD_SEED}}\" +server.maxplayers {{MAX_PLAYERS}} +rcon.password \"{{RCON_PASS}}\" +server.saveinterval {{SAVEINTERVAL}} {{ADDITIONAL_ARGS}}`,
    limits: {
        memory: 2048,
        swap: 0,
        disk: 0,
        io: 500,
        cpu: 0
    },
    environment: {
        HOSTNAME: 'A Rust Server',
        OXIDE: '0',
        LEVEL: '20',
        SERVER_MAP: 'Procedural Map',
        DESCRIPTION: 'Powered by DanBot Hosting - Free Hosting, Forever',
        SERVER_URL: 'https://danbot.host',
        WORLD_SIZE: '3000',
        WORLD_SEED: null,
        MAX_PLAYERS: '40',
        SERVER_IMG: null,
        RCON_PORT: '28016',
        RCON_PASS: 'DBHisthebest',
        SAVEINTERVAL: '60',
        ADDITIONAL_ARGS: null
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10
    },
    deploy: {
        locations: [14],
        dedicated_ip: false,
        port_range: []
    },
    start_on_completion: false,
    oom_disabled: false
});

const data = (serverName, userID) => {
    const toReturn = {
        paper: null,
        forge: null,
        fivem: null,
        altv: null,
        multitheftauto: null,
        ragemp: null,
        samp: null,
        bedrock: null,
        pocketminemp: null,
        gmod: null,
        csgo: null,
        arkse: null,
        rust: null
    };

    for (const [name, filled] of Object.entries(list)) {
        toReturn[name] = filled(serverName, userID);
    }
    return toReturn;
};

const createServer = data => axios({
        url: `${config.Pterodactyl.hosturl}/api/application/servers`,
        method: 'POST',
        followRedirect: true,
        maxRedirects: 14,
        headers: {
            Authorization: `Bearer ${config.Pterodactyl.apikey}`,
            'Content-Type': 'application/json',
            Accept: 'Application/vnd.pterodactyl.v1+json'
        },
        data
    });

module.exports = {
    createParams: data,
    createServer
};