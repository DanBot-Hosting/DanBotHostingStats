createListPrem.curseforge = (serverName, userID) => ({
    name: serverName,
    user: userID,
    nest: 1,
    egg: 88,
    docker_image: "ghcr.io/pterodactyl/yolks:java_17",
    startup: "java $([[ -f user_jvm_args.txt ]] && printf %s \"@user_jvm_args.txt\") -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true $([[ ! -f unix_args.txt ]] && printf %s \"-jar `cat .serverjar`\" || printf %s \"@unix_args.txt\")",
    limits: {
        memory: 6144,
        swap: -1,
        disk: 0,
        io: 500,
        cpu: 0,
    },
    environment: {
        PROJECT_ID: "EditThis",
        VERSION_ID: "latest",
        API_KEY: "EditThis"
    },
    feature_limits: {
        databases: 2,
        allocations: 1,
        backups: 10,
    },
    deploy: {
        locations: gamingPREM,
        dedicated_ip: false,
        port_range: [],
    },
    start_on_completion: false,
    oom_disabled: false,
});
