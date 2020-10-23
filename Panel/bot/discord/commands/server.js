const axios = require('axios');
var pretty = require('prettysize');
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
                            "MC_VERSION": "latest",
                            "BUILD_TYPE": "recommended",
                            "FORGE_VERSION": "1.16.3"
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
                            "allocations": 1
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
            } else {
                //Anything else
                let embed2 = new Discord.RichEmbed()
                    .setColor(`RED`)
                    .addField(`__**Supported By Server Creation:**__`, "NodeJS \nPython \nJava \nMinecraft.Paper \nMinecraft.Forge \nFiveM")
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
                            .addField('\u200b', '\u200b')
                            .addField('**LIMITS (0 = unlimited)**', 'MEMORY: ' + response.data.attributes.limits.memory + 'MB \nDISK: ' + response.data.attributes.limits.disk + 'MB \nCPU: ' + response.data.attributes.limits.cpu)
                            .addField('**MISC LIMITS**', 'DATABASES: ' + response.data.attributes.feature_limits.databases + '\nBACKUPS: ' + response.data.attributes.feature_limits.backups)
                        message.reply(embedstatus)
                    })});
            }
        } else if (args[0].toLowerCase() == "proxy") {
            const embed = new Discord.RichEmbed()
                .setTitle('__**How to link a domain to a website/server**__ \nCommand format: `' + config.DiscordBot.Prefix + 'server proxy domainhere serverid')
        }
    };
};