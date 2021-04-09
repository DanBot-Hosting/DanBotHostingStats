const axios = require('axios');

const gaming = [14]          // Gaming nodes
const botswebdb = [15]       // Bots, Websites and Databases nodes
const storage = [13]         // Storage nodes

/*
Node 1   : 9
Node 2   : 3
Node 3   : 5
Node 4   : 8
Node 5   : 10
Node 6   : 11
Node 7   : 12
Node 8   : 14
Node 9   : 15
Node 10  : 16
Node 11  : 17
Node 12  : 18
Node 13  : 19
Node 14  : 20
*/

const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
var getPassword = () => {

    var password = "";
    while (password.length < 16) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

let list = {};


/*

Web Servers

Nginx

*/
list.nginx = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 14,
    "egg": 48,
    "docker_image": "registry.gitlab.com/tenten8401/pterodactyl-nginx",
    "startup": `{{STARTUP_CMD}}`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STARTUP_CMD": "./start.sh"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
});


/*

Discord Bot

Red Discord Bot
Node.JS
Python
AIO - Golang, Node.js v14, Java 11, Python 2.7 & 3
Java

*/
list.reddiscordbot = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 47,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:bot_red",
    "startup": `PATH=$PATH:/home/container/.local/bin redbot pterodactyl --token {{TOKEN}} --prefix {{PREFIX}}`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "TOKEN": "Your discord bot api token",
        "PREFIX": "."
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
});
list.nodejs = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 50,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
    "startup": `/usr/local/bin/npm i && /usr/local/bin/node /home/container/{{BOT_JS_FILE}}`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "INSTALL_REPO": null,
        "INSTALL_BRANCH": null,
        "USER_UPLOAD": "0",
        "AUTO_UPDATE": "0",
        "BOT_JS_FILE": "index.js"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
});
list.python = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 22,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_python-3.8",
    "startup": "${STARTUP_CMD}",
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STARTUP_CMD": "bash"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
})
list.aio = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 46,
    "docker_image": "danielpmc/discordnode8",
    "startup": "${STARTUP_CMD}",
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STARTUP_CMD": "bash"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
})
list.java = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 25,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_openjdk-8-jre",
    "startup": "${STARTUP_CMD}",
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STARTUP_CMD": "bash"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
})


/*

Storage Servers

Storage

*/
list.storage = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 46,
    "docker_image": "danielpmc/discordnode8",
    "startup": "${STARTUP_CMD}",
    "limits": {
        "memory": 1,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 1
    },
    "environment": {
        "STARTUP_CMD": "STORAGE NODE"
    },
    "feature_limits": {
        "databases": 0,
        "allocations": 1,
        "backups": 0
    },
    "deploy": {
        "locations": storage,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false
})


/*

Minecraft Servers

Spigot
Waterfall
Paper
Forge
Bedrock
PocketMineMP

*/
list.spigot = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 58,
    "docker_image": "quay.io/pterodactyl/core:java-11\n",
    "startup": 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_JARFILE": "server.jar",
        "DL_PATH": null,
        "DL_VERSION": "latest"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.waterfall = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 57,
    "docker_image": "quay.io/pterodactyl/core:java-11\n",
    "startup": 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MINECRAFT_VERSION": "latest",
        "SERVER_JARFILE": "waterfall.jar",
        "DL_LINK": null,
        "BUILD_NUMBER": "latest"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.paper = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 3,
    "docker_image": "quay.io/pterodactyl/core:java-11",
    "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MINECRAFT_VERSION": "latest",
        "SERVER_JARFILE": "server.jar",
        "DL_PATH": "https://papermc.io/api/v2/projects/paper/versions/1.16.5/builds/503/downloads/paper-1.16.5-503.jar",
        "BUILD_NUMBER": "latest"
    },
    "feature_limits": {
        "databases": 0,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.forge = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 2,
    "docker_image": "quay.io/pterodactyl/core:java",
    "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_JARFILE": "server.jar",
        "MC_VERSION": "latest",
        "BUILD_TYPE": "recommended",
        "FORGE_VERSION": "1.16.3"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.bedrock = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 18,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_ubuntu",
    "startup": "./bedrock_server",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "BEDROCK_VERSION": "latest",
        "LD_LIBRARY_PATH": "."
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.pocketminemp = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 1,
    "egg": 28,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_ubuntu",
    "startup": "./bin/php7/bin/php ./PocketMine-MP.phar --no-wizard --disable-ansi",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "PMMP_VERSION": "latest"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})


/*

GTA Servers

FiveM - GTA V
alt:V - GTA V
Multi Theft Auto - GTA SA
RageMP - GTA V
SA-MP - GTA SA

*/
list.fivem = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 26,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_alpine",
    "startup": `$(pwd)/alpine/opt/cfx-server/ld-musl-x86_64.so.1 --library-path "$(pwd)/alpine/usr/lib/v8/:$(pwd)/alpine/lib/:$(pwd)/alpine/usr/lib/" -- $(pwd)/alpine/opt/cfx-server/FXServer +set citizen_dir $(pwd)/alpine/opt/cfx-server/citizen/ +set sv_licenseKey {{FIVEM_LICENSE}} +set steam_webApiKey {{STEAM_WEBAPIKEY}} +set sv_maxplayers {{MAX_PLAYERS}} +set serverProfile default +set txAdminPort {{TXADMIN_PORT}} $( [ "$TXADMIN_ENABLE" == "1" ] || printf %s '+exec server.cfg' )`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "FIVEM_LICENSE": "6pc7xbhxoep0ms5m5rsg09k11plzib6w",
        "MAX_PLAYERS": "32",
        "SERVER_HOSTNAME": "My new FXServer!",
        "FIVEM_VERSION": "latest",
        "DOWNLOAD_URL": null,
        "STEAM_WEBAPIKEY": "none",
        "TXADMIN_PORT": "40120",
        "TXADMIN_ENABLE": "0"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.altv = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 42,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_dotnet",
    "startup": `sleep 2 && ./altv-server`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "LD_LIBRARY_PATH": ".",
        "BUILD": "release",
        "PASSWORD": "changeme",
        "FIVEM_VERSION": "latest",
        "SERVER_DESC": "A alt:v server hosted for free by DanBot Hosting!"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.multitheftauto = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 43,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": `./mta-server64 --port {{SERVER_PORT}} --httpport {{SERVER_WEBPORT}} -n`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_WEBPORT": "22005"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.ragemp = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 44,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_debian",
    "startup": `./server`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_NAME": "RAGE:MP Unofficial server",
        "MAX_PLAYERS": "50",
        "ANNOUNCE": "0"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 2,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.samp = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 9,
    "egg": 45,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:game_samp",
    "startup": `./samp03svr`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "environment": {},
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})


/*

Source Engine Servers

Garry's Mod
CS:GO
ARK:SE

*/
list.gmod = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 2,
    "egg": 9,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": "./srcds_run -game garrysmod -console -port {{SERVER_PORT}} +ip 0.0.0.0 +host_workshop_collection {{WORKSHOP_ID}} +map {{SRCDS_MAP}} +gamemode {{GAMEMODE}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}} +maxplayers {{MAX_PLAYERS}}  -tickrate {{TICKRATE}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SRCDS_MAP": "gm_flatgrass",
        "STEAM_ACC": null,
        "SRCDS_APPID": "4020",
        "WORKSHOP_ID": null,
        "GAMEMODE": "sandbox",
        "MAX_PLAYERS": "32",
        "TICKRATE": "22"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.csgo = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 2,
    "egg": 7,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": "./srcds_run -game csgo -console -port {{SERVER_PORT}} +ip 0.0.0.0 +map {{SRCDS_MAP}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}}",
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SRCDS_MAP": "de_dust2",
        "STEAM_ACC": "BD1868C7DFC242D39EBE2062B10C6A3A",
        "SRCDS_APPID": "740"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.arkse = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 2,
    "egg": 6,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": `"cd ShooterGame/Binaries/Linux && ./ShooterGameServer {{SERVER_MAP}}?listen?SessionName='{{SESSION_NAME}}'?ServerPassword={{ARK_PASSWORD}}?ServerAdminPassword={{ARK_ADMIN_PASSWORD}}?Port={{PORT}}?MaxPlayers={{SERVER_MAX_PLAYERS}}?RCONPort={{RCON_PORT}}?QueryPort={{QUERY_PORT}}?RCONEnabled={{ENABLE_RCON}} -server -log"`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "ARK_PASSWORD": null,
        "ARK_ADMIN_PASSWORD": null,
        "SERVER_MAX_PLAYERS": "20",
        "SERVER_MAP": "TheIsland",
        "SESSION_NAME": "ARK SERVER",
        "PORT": "7777",
        "ENABLE_RCON": "false",
        "RCON_PORT": "27020",
        "QUERY_PORT": "27015",
        "SRCDS_APPID": "376030"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})


/*

Voice Servers

Lavalink
TeamSpeak 3
Mumble

*/
list.lavalink = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 3,
    "egg": 59,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_openjdk-13",
    "startup": `java -jar Lavalink.jar`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": [9, 3],
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.ts3 = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 3,
    "egg": 13,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:base_debian",
    "startup": `./ts3server default_voice_port={{SERVER_PORT}} query_port={{SERVER_PORT}} filetransfer_ip=0.0.0.0 filetransfer_port={{FILE_TRANSFER}} license_accepted=1`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "TS_VERSION": "3.12.1",
        "FILE_TRANSFER": "30033"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": [9, 3],
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.mumble = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 3,
    "egg": 12,
    "docker_image": "quay.io/pterodactyl/core:glibc",
    "startup": `./murmur.x86 -fg`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MAX_USERS": "100",
        "MUMBLE_VERSION": "1.3.1"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": [9, 3],
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})


/*

SteamCMD Servers

Barotrauma
Avorion
Assetto Corsa
Arma 3
7 Days to die
Rust

*/
list.barotrauma = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 56,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": './DedicatedServer -batchmode',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {},
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.avorion = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 55,
    "docker_image": "quay.io/pterodactyl/core:source",
    "startup": './server.sh --galaxy-name \\"{{GALAXY_NAME}}\\" --admin {{ADMIN_ID}} --datapath galaxy --port {{SERVER_PORT}} --query-port {{QUERY_PORT}} --steam-master-port {{STEAM_MASTER_PORT}} --steam-query-port {{STEAM_QUERY_PORT}} --max-players {{MAX_PLAYERS}} --difficulty {{DIFFICULTY}} --collision-damage {{COLLISION_DMG}} --save-interval {{SAVE_INTERVAL}} --same-start-sector {{SAME_START_SECTOR}} --server-name \\"{{SERVER_NAME}}\\" --threads {{GAME_THREADS}} --listed {{SERVER_LISTED}}',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "GALAXY_NAME": "Avorion",
        "SERVER_NAME": "DBH hosted Avorion Server",
        "ADMIN_ID": "0",
        "MAX_PLAYERS": "10",
        "DIFFICULTY": "0",
        "COLLISION_DMG": "1",
        "SAVE_INTERVAL": "300",
        "SAME_START_SECTOR": "true",
        "GAME_THREADS": "1",
        "SERVER_LISTED": "true",
        "SERVER_BETA": "false",
        "APP_ID": "565060",
        "LD_LIBRARY_PATH": "./linux64",
        "STEAM_MASTER_PORT": "27021",
        "STEAM_QUERY_PORT": "27020",
        "QUERY_PORT": "27003"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.assettocorsa = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 54,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": './acServer',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STEAM_USER": null,
        "STEAM_PASS": null,
        "STEAM_AUTH": null,
        "HOSTNAME": "DBH hosted Assetto Corsa server.",
        "PASSWORD": null,
        "ADMIN_PASSWORD": getPassword(),
        "HTTP_PORT": "8081"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.arma = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 53,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:game_arma3",
    "startup": './{{SERVER_BINARY}} -ip=0.0.0.0 -port={{SERVER_PORT}} -profiles=./serverprofile -bepath=./battleye -cfg=\\"{{BASIC}}\\" -config=\\"{{CONFIG}}\\" -mod=\\"{{MODIFICATIONS}}\\" -serverMod=\\"{{SERVERMODS}}\\" {{STARTUP_PARAMS}}',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STEAMCMD_APPID": "233780",
        "STEAM_USER": "your_steam_username",
        "STEAM_PASS": "your_steam_password",
        "SERVER_BINARY": "arma3server_x64",
        "STARTUP_PARAMS": "-noLogs",
        "CONFIG": "server.cfg",
        "BASIC": "basic.cfg",
        "MODIFICATIONS": null,
        "SERVERMODS": null,
        "UPDATE_SERVER": 0,
        "UPDATE_WORKSHOP": null,
        "MODS_LOWERCASE": 0,
        "STEAMCMD_EXTRA_FLAGS": null,
        "HC_NUM": "0",
        "HC_PASSWORD": null,
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.daystodie = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 52,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": './7DaysToDieServer.x86_64 -configfile=serverconfig.xml -quit -batchmode -nographics -dedicated -ServerPort=${SERVER_PORT} -ServerMaxPlayerCount=${MAX_PLAYERS} -GameDifficulty=${GAME_DIFFICULTY} -ControlPanelEnabled=false -TelnetEnabled=true -TelnetPort=8081 -logfile logs/latest.log & echo -e "Checing on telnet connection" && until nc -z -v -w5 127.0.0.1 8081; do echo "Waiting for telnet connection..."; sleep 5; done && telnet -E 127.0.0.1 8081',
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MAX_PLAYERS": "8",
        "GAME_DIFFICULTY": "2",
        "SRCDS_APPID": "294420",
        "AUTO_UPDATE": "1",
        "LD_LIBRARY_PATH": "."
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.rust = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 14,
    "docker_image": "quay.io/pterodactyl/core:rust",
    "startup": `./RustDedicated -batchmode +server.port {{SERVER_PORT}} +server.identity "rust" +rcon.port {{RCON_PORT}} +rcon.web true +server.hostname \"{{HOSTNAME}}\" +server.level \"{{LEVEL}}\" +server.description \"{{DESCRIPTION}}\" +server.url \"{{SERVER_URL}}\" +server.headerimage \"{{SERVER_IMG}}\" +server.worldsize \"{{WORLD_SIZE}}\" +server.seed \"{{WORLD_SEED}}\" +server.maxplayers {{MAX_PLAYERS}} +rcon.password \"{{RCON_PASS}}\" +server.saveinterval {{SAVEINTERVAL}} {{ADDITIONAL_ARGS}}`,
    "limits": {
        "memory": 2048,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "HOSTNAME": "A Rust Server",
        "OXIDE": "0",
        "LEVEL": "20",
        "SERVER_MAP": "Procedural Map",
        "DESCRIPTION": "Powered by DanBot Hosting - Free Hosting, Forever",
        "SERVER_URL": "https://danbot.host",
        "WORLD_SIZE": "3000",
        "WORLD_SEED": null,
        "MAX_PLAYERS": "40",
        "SERVER_IMG": null,
        "RCON_PORT": "28016",
        "RCON_PASS": "DBHisthebest",
        "SAVEINTERVAL": "60",
        "ADDITIONAL_ARGS": null
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gaming,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})


/*

Database Servers

MongoDB
Redis
Postgres

*/
list.mongodb = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 12,
    "egg": 35,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:db_mongo-4",
    "startup": "mongod --fork --dbpath /home/container/mongodb/ --port ${SERVER_PORT} --bind_ip 0.0.0.0 --logpath /home/container/logs/mongo.log; until nc -z -v -w5 127.0.0.1 ${SERVER_PORT}; do echo 'Waiting for mongodb connection...'; sleep 5; done && mongo 127.0.0.1:${SERVER_PORT} && mongo --eval 'db.getSiblingDB('admin').shutdownServer()' 127.0.0.1:${SERVER_PORT}",
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "MONGO_USER": "admin",
        "MONGO_USER_PASS": getPassword()
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.redis = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 12,
    "egg": 36,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:db_redis-6",
    "startup": "/usr/local/bin/redis-server /home/container/redis.conf --save 60 1 --dir /home/container/ --bind 0.0.0.0 --port {{SERVER_PORT}} --requirepass {{SERVER_PASSWORD}} --maxmemory {{SERVER_MEMORY}}mb --daemonize yes && redis-cli -p {{SERVER_PORT}} -a {{SERVER_PASSWORD}}; redis-cli -p {{SERVER_PORT}} -a {{SERVER_PASSWORD}} shutdown save",
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "SERVER_PASSWORD": "P@55w0rd"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
list.postgres = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 12,
    "egg": 37,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:db_postgres",
    "startup": `postgres  -D /home/container/postgres_db/`,
    "limits": {
        "memory": 0,
        "swap": 0,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "PGPASSWORD": "P@55word",
        "PGROOT": "ZPWgpMN4hETqjXAV",
        "PGUSER": "pterodactyl",
        "PGDATABASE": "pterodactyl"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": botswebdb,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})


let data = (serverName, userID) => {
    let toReturn = {
        nginx: null,
        reddiscordbot: null,
        nodejs: null,
        python: null,
        aio: null,
        storage: null,
        java: null,
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
        ts3: null,
        mumble: null,
        rust: null,
        mongodb: null,
        redis: null,
        postgres: null,
        daystodie: null,
        arma: null,
        assettocorsa: null,
        avorion: null,
        barotrauma: null,
        waterfall: null,
        spigot: null,
        lavalink: null
    };

    for (let [name, filled] of Object.entries(list)) {
        toReturn[name] = filled(serverName, userID);
    }
    return toReturn;
};

let createServer = (data) => {
    return axios({
        url: config.Pterodactyl.hosturl + "/api/application/servers",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        },
        data: data,
    })
}

module.exports = {
    createParams: data,
    createServer: createServer
};
