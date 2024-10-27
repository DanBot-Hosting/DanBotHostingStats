const generatePassword = require("../src/util/generatePassword.js");

const createServerConfig = (
  serverName,
  userID,
  nest,
  egg,
  docker_image,
  startup,
  environment = {},
  oom_disabled = false,
  premium = false,
  memory = premium ? 6144 : 0,
  location = premium ? botswebdbPREM : botswebdbFREE
) => ({
  name: serverName,
  user: userID,
  nest: nest,
  egg: egg,
  docker_image: docker_image,
  startup: startup,
  limits: {
    memory: memory,
    swap: -1,
    disk: premium ? 0 : 10240,
    io: 500,
    cpu: 0,
  },
  environment: environment,
  feature_limits: {
    databases: 2,
    allocations: 1,
    backups: 10,
  },
  deploy: {
    locations: location,
    dedicated_ip: false,
    port_range: [],
  },
  start_on_completion: false,
  oom_disabled: oom_disabled,
});

const createList = {
  aio: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      5,
      46,
      "danbothosting/aio",
      "${STARTUP_CMD}",
      { STARTUP_CMD: "bash" },
      false,
      premium
    ),
  bun: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      5,
      90,
      "ghcr.io/parkervcp/yolks:bun_latest",
      'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; if [[ ! -z ${BUN_PACKAGES} ]]; then bun install ${BUN_PACKAGES}; fi; if [[ ! -z ${RMBUN_PACKAGES} ]]; then bun remove ${RMBUN_PACKAGES}; fi; if [ -f /home/container/package.json ]; then bun install; fi; bun run {{MAIN_FILE}}',
      {
        GIT_ADDRESS: null,
        USER_UPLOAD: 0,
        AUTO_UPDATE: 0,
        MAIN_FILE: "index.js",
        BUN_PACKAGES: null,
        RMBUN_PACKAGES: null,
        BRANCH: null,
        USERNAME: null,
        ACCESS_TOKEN: null,
      },
      false,
      premium
    ),
  codeserver: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      66,
      "ghcr.io/parkervcp/yolks:nodejs_17",
      `sh .local/lib/code-server-{{VERSION}}/bin/code-server`,
      { PASSWORD: generatePassword(), VERSION: "latest" },
      false,
      premium
    ),
  gitea: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      67,
      "quay.io/parkervcp/pterodactyl-images:base_debian",
      `./gitea web -p {{SERVER_PORT}} -c ./app.ini`,
      { DISABLE_SSH: "true", SSH_PORT: "2020" },
      false,
      premium
    ),
  grafana: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      73,
      "ghcr.io/parkervcp/yolks:debian",
      "./bin/grafana-server web",
      { GRAFANA_VERSION: "latest" },
      false,
      premium
    ),
  haste: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      68,
      "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
      `npm start`,
      {},
      false,
      premium
    ),
  java: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      5,
      25,
      "ghcr.io/parkervcp/yolks:java_17",
      "${STARTUP_CMD}",
      { STARTUP_CMD: "bash" },
      false,
      premium
    ),
  mariadb: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      12,
      69,
      "quay.io/parkervcp/pterodactyl-images:db_mariadb",
      `{ /usr/sbin/mysqld & } && sleep 5 && mysql -u root`,
      {},
      false,
      premium
    ),
  mongodb: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      12,
      35,
      "ghcr.io/parkervcp/yolks:mongodb_4",
      "mongod --fork --dbpath /home/container/mongodb/ --port ${SERVER_PORT} --bind_ip 0.0.0.0 --logpath /home/container/logs/mongo.log -f /home/container/mongod.conf; until nc -z -v -w5 127.0.0.1 ${SERVER_PORT}; do echo 'Waiting for mongodb connection...'; sleep 5; done && mongo --username ${MONGO_USER} --password ${MONGO_USER_PASS} --host 127.0.0.1:${SERVER_PORT} && mongo --eval \"db.getSiblingDB('admin').shutdownServer()\" 127.0.0.1:${SERVER_PORT}",
      { MONGO_USER: "admin", MONGO_USER_PASS: generatePassword() },
      false,
      premium
    ),
  mumble: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      3,
      12,
      "ghcr.io/parkervcp/yolks:voice_mumble",
      `mumble-server -fg -ini murmur.ini`,
      { MAX_USERS: "100" },
      false,
      premium
    ),
  nginx: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      14,
      48,
      "danbothosting/nginx",
      `{{STARTUP_CMD}}`,
      { STARTUP_CMD: "./start.sh" },
      false,
      premium
    ),
  nodejs: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      5,
      50,
      "ghcr.io/parkervcp/yolks:nodejs_20",
      `/usr/local/bin/npm i && /usr/local/bin/node /home/container/{{BOT_JS_FILE}}`,
      { BOT_JS_FILE: "index.js" },
      false,
      premium
    ),
  openx: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      17,
      79,
      "quay.io/parkervcp/pterodactyl-images:debian_nodejs-16",
      'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi; /usr/local/bin/node /home/container/Src/index.js',
      {
        FILELENGTH: "8",
        PASSWORD: generatePassword(),
        MAXUPLOAD: "1024",
        AUTO_UPDATE: 0,
      },
      false,
      premium
    ),
  postgres14: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      12,
      37,
      "ghcr.io/parkervcp/yolks:postgres_14",
      `postgres  -D /home/container/postgres_db/`,
      { PGPASSWORD: generatePassword(), PGUSER: "pterodactyl" },
      false,
      premium
    ),
  postgres16: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      12,
      80,
      "ghcr.io/parkervcp/yolks:postgres_16",
      `postgres  -D /home/container/postgres_db/`,
      { PGPASSWORD: generatePassword(), PGUSER: "pterodactyl" },
      false,
      premium
    ),
  python: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      5,
      22,
      "ghcr.io/parkervcp/yolks:python_3.9",
      'if [[ ! -z "{{PY_PACKAGES}}" ]]; then pip install -U --prefix .local {{PY_PACKAGES}}; fi; if [[ -f /home/container/${REQUIREMENTS_FILE} ]]; then pip install -U --prefix .local -r ${REQUIREMENTS_FILE}; fi; ${STARTUP_CMD}',
      { REQUIREMENTS_FILE: "requirements.txt", STARTUP_CMD: "bash" },
      false,
      premium
    ),
  rabbitmq: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      85,
      "ghcr.io/parkervcp/yolks:erlang_26",
      "./sbin/rabbitmq-server",
      { RABBITMQ_VERSION: "latest" },
      false,
      premium
    ),
  redbot: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      5,
      72,
      "ghcr.io/parkervcp/yolks:bot_red",
      "PATH=$PATH:/home/container/.local/bin redbot pterodactyl --token {{TOKEN}} --prefix {{PREFIX}}",
      {
        TOKEN: "FILL_THIS_OUT",
        PREFIX: "FILL_THIS_OUT",
        OWNER: "FILL_THIS_OUT",
      },
      false,
      premium
    ),
  redis: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      12,
      36,
      "quay.io/parkervcp/pterodactyl-images:db_redis-6",
      "/usr/local/bin/redis-server /home/container/redis.conf --save 60 1 --dir /home/container/ --bind 0.0.0.0 --port {{SERVER_PORT}} --requirepass {{SERVER_PASSWORD}} --maxmemory {{SERVER_MEMORY}}mb --daemonize yes && redis-cli -p {{SERVER_PORT}} -a {{SERVER_PASSWORD}}; redis-cli -p {{SERVER_PORT}} -a {{SERVER_PASSWORD}} shutdown save",
      { SERVER_PASSWORD: generatePassword() },
      false,
      premium
    ),
  sharex: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      17,
      62,
      "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
      "/usr/local/bin/node /home/container/src/index.js",
      {},
      false,
      premium
    ),
  storage: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      87,
      "ghcr.io/parkervcp/yolks:alpine",
      `echo -e "\n\nThere is no need to start this server. The SFTP service is always running. Feel free to stop the server now.\n\t(Sub-users can be added via the Users tab to add/remove access to the share in real time)\n\n"`,
      {},
      false,
      premium
    ),
  ts3: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      3,
      13,
      "quay.io/parkervcp/pterodactyl-images:base_debian",
      `./ts3server default_voice_port={{SERVER_PORT}} query_port={{SERVER_PORT}} filetransfer_ip=0.0.0.0 filetransfer_port={{FILE_TRANSFER}} license_accepted=1`,
      {
        TS_VERSION: "latest",
        FILE_TRANSFER: "30033",
        QUERY_PORT: "10011",
        QUERY_PROTOCOLS_VAR: "raw,http,ssh",
        QUERY_SSH: "10022",
        QUERY_HTTP: "10080",
      },
      false,
      premium
    ),
  uptimekuma: (serverName, userID, premium = false) =>
    createServerConfig(
      serverName,
      userID,
      19,
      70,
      "ghcr.io/parkervcp/apps:uptimekuma",
      'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then npm run setup; fi; /usr/local/bin/node /home/container/server/server.js --port={{SERVER_PORT}}',
      {
        GIT_ADDRESS: "https://github.com/louislam/uptime-kuma",
        JS_FILE: "server/server.js",
        AUTO_UPDATE: 1,
      },
      false,
      premium
    ),
  // Premium-only servers with gamingPREM location
  altv: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      9,
      42,
      "ghcr.io/parkervcp/games:altv",
      `./altv-server`,
      {
        LD_LIBRARY_PATH: ".",
        BUILD: "release",
        PASSWORD: "changeme",
        SERVER_DESC: "A alt:v server hosted for free by DanBot Hosting!",
      },
      true,
      true,
      6144,
      gamingPREM
    ),
  arkse: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      2,
      6,
      "quay.io/pterodactyl/core:source",
      `"cd ShooterGame/Binaries/Linux && ./ShooterGameServer {{SERVER_MAP}}?listen?SessionName='{{SESSION_NAME}}'?ServerPassword={{ARK_PASSWORD}}?ServerAdminPassword={{ARK_ADMIN_PASSWORD}}?Port={{PORT}}?MaxPlayers={{SERVER_MAX_PLAYERS}}?RCONPort={{RCON_PORT}}?QueryPort={{QUERY_PORT}}?RCONEnabled={{ENABLE_RCON}} -server -log"`,
      {
        ARK_PASSWORD: null,
        ARK_ADMIN_PASSWORD: null,
        SERVER_MAX_PLAYERS: "20",
        SERVER_MAP: "TheIsland",
        SESSION_NAME: "ARK SERVER",
        PORT: "7777",
        ENABLE_RCON: "false",
        RCON_PORT: "27020",
        QUERY_PORT: "27015",
        SRCDS_APPID: "376030",
      },
      true,
      true,
      6144,
      gamingPREM
    ),
  assettocorsa: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      4,
      54,
      "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
      "./acServer",
      {
        STEAM_USER: null,
        STEAM_PASS: null,
        STEAM_AUTH: null,
        HOSTNAME: "DBH hosted Assetto Corsa server.",
        PASSWORD: null,
        ADMIN_PASSWORD: generatePassword(),
        HTTP_PORT: "8081",
      },
      true,
      true,
      6144,
      gamingPREM
    ),
  avorion: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      4,
      55,
      "quay.io/pterodactyl/core:source",
      './server.sh --galaxy-name \\"{{GALAXY_NAME}}\\" --admin {{ADMIN_ID}} --datapath galaxy --port {{SERVER_PORT}} --query-port {{QUERY_PORT}} --steam-master-port {{STEAM_MASTER_PORT}} --steam-query-port {{STEAM_QUERY_PORT}} --max-players {{MAX_PLAYERS}} --difficulty {{DIFFICULTY}} --collision-damage {{COLLISION_DMG}} --save-interval {{SAVE_INTERVAL}} --same-start-sector {{SAME_START_SECTOR}} --server-name \\"{{SERVER_NAME}}\\" --threads {{GAME_THREADS}} --listed {{SERVER_LISTED}}',
      {
        GALAXY_NAME: "Avorion",
        SERVER_NAME: "DBH hosted Avorion Server",
        ADMIN_ID: "0",
        MAX_PLAYERS: "10",
        DIFFICULTY: "0",
        COLLISION_DMG: "1",
        SAVE_INTERVAL: "300",
        SAME_START_SECTOR: "true",
        GAME_THREADS: "1",
        SERVER_LISTED: "true",
        SERVER_BETA: "false",
        APP_ID: "565060",
        LD_LIBRARY_PATH: "./linux64",
        STEAM_MASTER_PORT: "27021",
        STEAM_QUERY_PORT: "27020",
        QUERY_PORT: "27003",
      },
      true,
      true,
      6144,
      gamingPREM
    ),
  barotrauma: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      4,
      56,
      "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
      "./DedicatedServer -batchmode",
      {},
      false,
      true,
      6144,
      gamingPREM
    ),
  bedrock: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      18,
      "ghcr.io/parkervcp/yolks:debian",
      "./bedrock_server",
      {
        BEDROCK_VERSION: "latest",
        LD_LIBRARY_PATH: ".",
        SERVERNAME: "Bedrock Dedicated Server",
        GAMEMODE: "survival",
        DIFFICULTY: "easy",
        CHEATS: "false",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  csgo: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      2,
      7,
      "quay.io/pterodactyl/core:source",
      "./srcds_run -game csgo -console -port {{SERVER_PORT}} +ip 0.0.0.0 +map {{SRCDS_MAP}} -strictportbind -norestart +sv_setsteamaccount {{STEAM_ACC}}",
      {
        SRCDS_MAP: "de_dust2",
        STEAM_ACC: "BD1868C7DFC242D39EBE2062B10C6A3A",
        SRCDS_APPID: "740",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  curseforge: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      88,
      "ghcr.io/pterodactyl/yolks:java_17",
      'java $([[ -f user_jvm_args.txt ]] && printf %s "@user_jvm_args.txt") -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true $([[ ! -f unix_args.txt ]] && printf %s "-jar `cat .serverjar`" || printf %s "@unix_args.txt")',
      {
        PROJECT_ID: "EditThis",
        VERSION_ID: "latest",
        API_KEY: "EditThis",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  daystodie: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      4,
      52,
      "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
      './7DaysToDieServer.x86_64 -configfile=serverconfig.xml -quit -batchmode -nographics -dedicated -ServerPort=${SERVER_PORT} -ServerMaxPlayerCount=${MAX_PLAYERS} -GameDifficulty=${GAME_DIFFICULTY} -ControlPanelEnabled=false -TelnetEnabled=true -TelnetPort=8081 -logfile logs/latest.log & echo -e "Checing on telnet connection" && until nc -z -v -w5 127.0.0.1 8081; do echo "Waiting for telnet connection..."; sleep 5; done && telnet -E 127.0.0.1 8081',
      {
        MAX_PLAYERS: "8",
        GAME_DIFFICULTY: "2",
        SRCDS_APPID: "294420",
        AUTO_UPDATE: "1",
        LD_LIBRARY_PATH: ".",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  forge: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      2,
      "ghcr.io/pterodactyl/yolks:java_18",
      `java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true $( [[  ! -f unix_args.txt ]] && printf %s "-jar {{SERVER_JARFILE}}" || printf %s "@unix_args.txt" )`,
      {
        SERVER_JARFILE: "server.jar",
        MC_VERSION: "latest",
        BUILD_TYPE: "recommended",
        FORGE_VERSION: null,
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  influxdb: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      12,
      93,
      "ghcr.io/parkervcp/yolks:debian",
      `./influxd  --http-bind-address 0.0.0.0:{{SERVER_PORT}}`,
      {
        VERSION: "v2.4",
      },
      false,
      true,
      0,
      botswebdbPREM
    ),
  spigot: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      58,
      "ghcr.io/pterodactyl/yolks:java_17",
      "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
      {
        SERVER_JARFILE: "server.jar",
        DL_PATH: null,
        DL_VERSION: "latest",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  waterfall: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      57,
      "quay.io/pterodactyl/core:java-11\n",
      "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}",
      {
        MINECRAFT_VERSION: "latest",
        SERVER_JARFILE: "waterfall.jar",
        DL_LINK: null,
        BUILD_NUMBER: "latest",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  multitheftauto: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      9,
      43,
      "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
      `./mta-server64 --port {{SERVER_PORT}} --httpport {{SERVER_WEBPORT}} -n`,
      {
        SERVER_WEBPORT: "22005",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  pocketminemp: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      28,
      "ghcr.io/parkervcp/yolks:debian",
      "./bin/php7/bin/php ./PocketMine-MP.phar --no-wizard --disable-ansi",
      {
        VERSION: "PM5",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  palworld: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      4,
      86,
      "ghcr.io/parkervcp/steamcmd:debian",
      `/home/container/Pal/Binaries/Linux/PalServer-Linux-Test Pal -port={{SERVER_PORT}} -players={{MAX_PLAYERS}} -useperfthreads -NoAsyncLoadingThread -UseMultithreadForDS -publicip={{PUBLIC_IP}} -publicport={{SERVER_PORT}} EpicApp=PalServer -servername="{{SRV_NAME}}" -serverpassword="{{SRV_PASSWORD}}" -adminpassword="{{ADMIN_PASSWORD}}"`,
      {
        SRCDS_APPID: "2394010",
        AUTO_UPDATE: 1,
        MAX_PLAYERS: 32,
        SRV_NAME: "A Palword Server hosted on DanBot Hosting LTD",
        SRV_PASSWORD: generatePassword(),
        ADMIN_PASSWORD: generatePassword(),
        PUBLIC_IP: "128.254.225.78",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
  paper: (serverName, userID) =>
    createServerConfig(
      serverName,
      userID,
      1,
      3,
      "ghcr.io/pterodactyl/yolks:java_17",
      "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}",
      {
        MINECRAFT_VERSION: "latest",
        SERVER_JARFILE: "server.jar",
        DL_PATH:
          "https://papermc.io/api/v2/projects/paper/versions/1.16.5/builds/503/downloads/paper-1.16.5-503.jar",
        BUILD_NUMBER: "latest",
      },
      false,
      true,
      6144,
      gamingPREM
    ),
};

module.exports = createList;
