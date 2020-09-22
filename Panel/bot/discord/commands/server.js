const axios = require('axios');
exports.run = async (client, message, args) => {
    const otherargs = message.content.split(' ').slice(3).join(' ');
    if (userData.get(message.author.id) == null) {
        message.channel.send("This account is not linked. Please link it using `" + config.DiscordBot.Prefix + "link`, then retry this command")
    } else {
        if (!args[0]) {
            //No args
            let embed = new Discord.RichEmbed()
                .setTitle('__**Commands**__ \n' + config.DiscordBot.Prefix + 'server create type servername \n' + config.DiscordBot.Prefix + 'server list')

        } else if (args[0].toLowerCase() == "create") {
            //Do server creation things
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
                            "allocations": 1
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
                        console.log(response)
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
                            "allocations": 1
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
                            "allocations": 1
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
            } else if (args[1].toLowerCase() === "minecraft.paper") {
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
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [5],
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
            } else if (args[1].toLowerCase() === "minecraft.forge") {
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
                            "MC_VERSION": "latest"
                        },
                        "feature_limits": {
                            "databases": 0,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [5],
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
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [5],
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
            } else {
                //Anything else
                let embed2 = new Discord.RichEmbed()
                    .setColor(`RED`)
                    .addField(`__**Supported By Server Creation:**__`, "NodeJS \nPython \nJava \nMinecraft.Paper \nMinecraft.Forge \nFiveM")
                message.channel.send(embed2)
            }
        } else if (args[0].toLowerCase() == "delete") {
            //delete server things
            message.channel.send('Uh this isnt done yet...')
        }
    };
};