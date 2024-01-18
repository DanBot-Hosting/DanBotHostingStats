createListPrem.mongodb = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 12,
    egg: 35,
    docker_image: "ghcr.io/parkervcp/yolks:mongodb_4",
    startup: `mongod --fork --dbpath /home/container/mongodb/ --port ${SERVER_PORT} --bind_ip 0.0.0.0 --logpath /home/container/logs/mongo.log -f /home/container/mongod.conf; until nc -z -v -w5 127.0.0.1 ${SERVER_PORT}; do echo 'Waiting for mongodb connection...'; sleep 5; done && mongo --username ${MONGO_USER} --password ${MONGO_USER_PASS} --host 127.0.0.1:${SERVER_PORT} && mongo --eval "db.getSiblingDB('admin').shutdownServer()" 127.0.0.1:${SERVER_PORT}`,
    limits: {
        memory: 0,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        MONGO_USER: "admin",
        MONGO_USER_PASS: getPassword(),
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: botswebdbPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
    oom_disabled: false,
});
