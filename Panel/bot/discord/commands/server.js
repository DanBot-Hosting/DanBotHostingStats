const axios = require('axios');
var pretty = require('prettysize');
const fs = require('fs');
const path = require('path');
const {NodeSSH} = require('node-ssh');
const rif = require('replace-in-file');
exports.run = async (client, message, args) => {
    const otherargs = message.content.split(' ').slice(3).join(' ');
    if (userData.get(message.author.id) == null) {
        message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID. \nIf you have not made an account yet please check out `" + config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" + config.DiscordBot.Prefix + "user link`")
    } else {
        if (!args[0]) {
            //No args
            let embed = new Discord.RichEmbed()
                .setTitle('__**Commands**__ \nCreate a server: `' + config.DiscordBot.Prefix + 'server create type servername` \nServer Types: `' + config.DiscordBot.Prefix + 'server create list` \nServer Status: `' + config.DiscordBot.Prefix + 'server status serverid`')
            message.channel.send(embed)

        } else if (args[0].toLowerCase() == "create") {
            //Do server creation things
            if (!args[1]) {
                let embed = new Discord.RichEmbed()
                    .setTitle('__**Commands**__ \nCreate a server: `' + config.DiscordBot.Prefix + 'server create type servername` \nServer Types: `' + config.DiscordBot.Prefix + 'server create list`')
                message.channel.send(embed)
            }
            if (args[1].toLowerCase() === "nodejs") {
                //Code for nodejs server
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 5,
                        "egg": 16,
                        "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
                        "startup": `if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi && /usr/local/bin/npm install --production && /usr/local/bin/node /home/container/{{BOT_JS_FILE}}`,
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
                            "databases": 0,
                            "allocations": 1,
                            "backups": 10
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        
                    })
                }
            } else if (args[1].toLowerCase() === "python") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "databases": 0,
                            "allocations": 1,
                            "backups": 10
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        
                    })
                }
            } else if (args[1].toLowerCase() === "java") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "databases": 0,
                            "allocations": 1,
                            "backups": 10
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                            .addField(`__**WARNING:**__`, "**Using a java server to run gameservers is __NOT__ allowed. You could have your server deleted for doing so.**")
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        
                    })
                }
            } else if (args[1].toLowerCase() === "paper") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 1,
                        "egg": 3,
                        "docker_image": "quay.io/pterodactyl/core:java",
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
                            "DL_PATH": "https://papermc.io/api/v1/paper/1.16.1/138/download",
                            "BUILD_NUMBER": "latest"
                        },
                        "feature_limits": {
                            "databases": 0,
                            "allocations": 1,
                            "backups": 10
                        },
                        "deploy": {
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        
                    })
                }
            } else if (args[1].toLowerCase() === "forge") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "fivem") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "bedrock") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "pocketminemp") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "gmod") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "cs:go") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "ark:se") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "ts3") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "mumble") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "rust") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "mongodb") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 12,
                        "egg": 35,
                        "docker_image": "quay.io/parkervcp/pterodactyl-images:db_mongo-4",
                        "startup": "mongod --fork --dbpath /home/container/mongodb/ --port ${SERVER_PORT} --logpath /home/container/logs/mongo.log; until nc -z -v -w5 127.0.0.1 ${SERVER_PORT}; do echo 'Waiting for mongodb connection...'; sleep 5; done && mongo 127.0.0.1:${SERVER_PORT} && mongo --eval 'db.getSiblingDB('admin').shutdownServer()' 127.0.0.1:${SERVER_PORT}",
                        "limits": {
                            "memory": 0,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "MONGO_USER": "admin",
                            "MONGO_USER_PASS": "aP@55word"
                        },
                        "feature_limits": {
                            "databases": 2,
                            "allocations": 1,
                            "backups": 10
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "redis") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else if (args[1].toLowerCase() === "postgres") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
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
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false,
                        "oom_disabled": false
                    };

                    //Sending the data:
                    axios({
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
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                    })
                }
            } else {
                //Anything else
                let embed2 = new Discord.RichEmbed()
                    .setColor(`RED`)
                    .addField(`__**Minecraft:**__`, "Forge \nPaper \nBedrock \nPocketmineMP", true)
                    .addField(`__**Grand Theft Auto 5:**__`, "FiveM", true)
                    .addField(`__**Bots:**__`, "NodeJS \nPython \nJava", true)
                    .addField(`__**Source Engine:**__`, "GMod \nCS:GO \nARK:SE", true)
                    .addField(`__**Voice Servers:**__`, "TS3 \nMumble", true)
                    .addField(`__**SteamCMD:**__`, "Rust", true)
                    .addField(`__**Databases:**__`, "MongoDB \nRedis \nPostgres", true)
                    .setFooter("Example: " + config.DiscordBot.Prefix + "server create NodeJS Testing Server")
                message.channel.send(embed2)
            }
        } else if (args[0].toLowerCase() == "delete") {
            //delete server things
            message.channel.send('Checking server ' + args[1]).then((msg) => {
                axios({
                    url: config.Pterodactyl.hosturl + "/api/application/servers/" + args[1],
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(response => {
                    console.log(response)
                    msg.edit('Are you sure you want to delete `' + response.data.attributes.name + '`?\nPlease type `confirm` to delete this server. You have 1min until this will expire \n\n**You can not restore the server once it has been deleted**')
                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000, max: 2 });
                    collector.on('collect', message => {
                        if (message == "confirm") {
                            message.delete()
                            axios({
                                url: config.Pterodactyl.hosturl + "/api/application/servers/" + args[1],
                                method: 'DELETE',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                                    'Content-Type': 'application/json',
                                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                                }
                            }).then(response => {
                                msg.edit('Server deleted!')
                            });
                        } else {
                            message.delete()
                            msg.edit('Request cancelled!')
                        }
                    })
                });
            })
        } else if (args[0].toLowerCase() == "manage") {
            message.channel.send('Uh this isnt done yet...')
        } else if (args[0] == "list") {
            message.channel.send('Loading servers...')
            //List servers
            var arr = [];

            axios({
                url: "https://panel.danbot.host" + "/api/application/servers",
                method: 'GET',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': 'Bearer '  + config.Pterodactyl.apikey,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                }
            }).then(resources => {
                var countmax = resources.data.meta.pagination.total_pages
                var i2 = countmax++
    
                var i = 0
                while (i <i2) {
                        //console.log(i)
                        axios({
                            url: "https://panel.danbot.host" + "/api/application/servers?page=" + i,
                            method: 'GET',
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                                'Content-Type': 'application/json',
                                'Accept': 'Application/vnd.pterodactyl.v1+json',
                            }
                        }).then(response => {
                            //console.log(resources.data.meta)
                            arr.push(...response.data.data)
                        });
                        i++
                    }
                    console.log(resources.data.meta.pagination)
                    var total = resources.data.meta.pagination.total
                });

                setTimeout(async () => {
                    //console.log(arr.length)
                    const output = await arr.filter(usr => usr.attributes ? usr.attributes.user == userData.get(message.author.id).consoleID : false)
                    setTimeout(() => {
                        var clean = output.map(e => "`" + e.attributes.name + "` Server ID: `" + e.attributes.identifier + "`\n")
                        var clean2 = clean.toString().replace(/^\s+|\s+$/g,'')
                        const embed = new Discord.RichEmbed()
                            .addField('__**Your Servers:**__', "Server Name: \n" +  clean2)
                        message.channel.send(embed)
                        //console.log(output)
                    },500)
                }, 10000)
        } else if (args[0].toLowerCase() == "status") {
            if (!args[1]) {
                let embed = new Discord.RichEmbed()
                    .setColor(`GREEN`)
                    .addField(`__**Server Status**__`, 'What server would you like to view? Please type: `' + config.DiscordBot.Prefix + 'server status serverid`', true)
                message.channel.send(embed)
            } else {
                axios({
                    url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[1],
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(response => {
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[1] + "/resources",
                        method: 'GET',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        }
                    }).then(resources => {
                        let embedstatus = new Discord.RichEmbed()
                            .setColor('GREEN')
                            .addField('**Status**', resources.data.attributes.current_state, true)
                            .addField('**CPU Usage**', resources.data.attributes.resources.cpu_absolute + '%')
                            .addField('**RAM Usage**', pretty(resources.data.attributes.resources.memory_bytes) + '  out of UNLIMITED MB')
                            .addField('**DISK Usage**', pretty(resources.data.attributes.resources.disk_bytes) + '  out of UNLIMITED MB')
                            .addField('**NET Usage**', 'UPLOADED: ' + pretty(resources.data.attributes.resources.network_tx_bytes) + ', DOWNLOADED: ' + pretty(resources.data.attributes.resources.network_rx_bytes))
                            .addField('**NODE**', response.data.attributes.node)
                            .addField('**FULL ID**', response.data.attributes.uuid)
                            .addField('\u200b', '\u200b')
                            .addField('**LIMITS (0 = unlimited)**', 'MEMORY: ' + response.data.attributes.limits.memory + 'MB \nDISK: ' + response.data.attributes.limits.disk + 'MB \nCPU: ' + response.data.attributes.limits.cpu)
                            .addField('**MISC LIMITS**', 'DATABASES: ' + response.data.attributes.feature_limits.databases + '\nBACKUPS: ' + response.data.attributes.feature_limits.backups)
                        message.reply(embedstatus)
                    })});
            }
        } else if (args[0].toLowerCase() == "proxy") {
            if (message.author.id == "137624084572798976") {
            let domainfilter = [".com", ".co.uk", ".us", ".xyz", ".org"];

            const embed = new Discord.RichEmbed()
                .setTitle('__**How to link a domain to a website/server**__ \nCommand format: `' + config.DiscordBot.Prefix + 'server proxy domainhere serverid')
            if (!args[1] || !args[1].includes(domainfilter)) {
                message.channel.send(embed)
            } else {
                if (!args[2]) {
                    message.channel.send(embed)
                } else {
                    //SSH Connection
                    ssh.connect({
                        host: config.SSH.Host,
                        username: config.SSH.User,
                        port: config.SSH.Port,
                        password: config.SSH.Password,
                        tryKeyboard: true,
                    })

                    //Copy template file. Ready to be changed!
                    fs.copySync(path.resolve('/root/DBH/Panel/proxy/template.txt'), '/root/DBH/Panel/proxy/' + args[1] + '.conf');

                    setTimeout(() => {
                        //Change Domain
                        const domainchange = replace.sync({
                            files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                            from: "REPLACE-DOMAIN",
                            to: args[1],
                            countMatches: true,
                        });

                        //Change Server IP
                        setTimeout(() => {
                            const ipchange = replace.sync({
                                files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                from: "REPLACE-IP",
                                to: args[1],
                                countMatches: true,
                            });

                            //Change Server Port
                            setTimeout(() => {
                                const portchange = replace.sync({
                                    files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                    from: "REPLACE-PORT",
                                    to: args[1],
                                    countMatches: true,
                                });

                                //Upload file to /etc/apache2/sites-available
                                setTimeout(() => {
                                    ssh.putFile('/root/DBH/Panel/proxy/' + args[1] + '.txt', '/etc/apache2/sites-available/' + args[1] + ".conf").then(function() {
                                        
                                        //Run command to genate SSL cert.
                                        ssh.execCommand(`certbot certonly -d ${args[1]} --non-interactive --agree-tos -m danielpd93@gmail.com`, { cwd:'/root' }).then(function(result) {
                                            if (result.stderr) {
                                                //If an error exists. Eror and delete the proxy file
                                                message.channel.send('Error making SSL cert. Either the domain is not pointing to `154.27.68.234` or cloudflare proxy is enabled!')
                                                fs.unlinkSync("/root/DBH/Panel/proxy/" + args[1] + ".txt");
                                            } else {
                                                //No error. Continue to enable site on apache2 then restart
                                                console.log('SSL Gen complete. Continue!')

                                                ssh.execCommand(`a2ensite ${args[1]} && service apache2 restart`, { cwd:'/root' }).then(function(result) {
                                                    if (result.stderr) {
                                                        //If an error exists. Eror and delete the proxy file
                                                        message.channel.send('ERROR: Cancelled. Please contact Dan')
                                                    } else {
                                                        //Complete
                                                        console.log('Enabled website.')
                                                    }
                                                })
                                            }
                                        })
                                      }, function(error) {
                                          //If error exists. Error and delete proxy file
                                          fs.unlinkSync("/root/DBH/Panel/proxy/" + args[1] + ".txt");
                                          message.channel.send("FAILED \nERROR: " + error);
                                    })
                                }, 250) //END - Upload file to /etc/apache2/sites-available
                            }, 100) //END - Change Server Port
                        }, 100) //END - Change Server IP
                    }, 250) //END - //Change Domain
                }
            }
        }
        } 
    };
};