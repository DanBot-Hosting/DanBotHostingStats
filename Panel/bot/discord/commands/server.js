const axios = require('axios');
var pretty = require('prettysize');
const fs = require('fs');
const path = require('path');
const serverCreateSettings = require('../../../createData');
const serverCreateSettings_Prem = require('../../../createData_Prem');
const humanizeDuration = require('humanize-duration');

const {
    NodeSSH
} = require('node-ssh')
const ssh = new NodeSSH()
const move_ssh = new NodeSSH()
const rif = require('replace-in-file');

let cooldown = {};

exports.run = async (client, message, args) => {
    if (cooldown[message.author.id] == null) {
        cooldown[message.author.id] = {
            nCreate: null,
            pCreate: null,
            delete: null
        }
    }

    let helpEmbed = new Discord.RichEmbed()
        .setColor(`RED`).setDescription(`List of servers: (use ${config.DiscordBot.Prefix}server create <type> <name>)`)
        .addField(`__**Minecraft:**__`, "Forge \nPaper \nBedrock \nPocketmineMP", true)
        .addField(`__**Grand Theft Auto:**__`, "FiveM \nalt:V \nmultitheftauto \nRage.MP \nSA-MP", true)
        .addField(`__**Bots:**__`, "NodeJS \nPython \nJava \naio", true)
        .addField(`__**Source Engine:**__`, "GMod \nCS:GO \nARK:SE", true)
        .addField(`__**Voice Servers:**__`, "TS3 \nMumble", true)
        .addField(`__**SteamCMD:**__`, "Rust", true)
        .addField(`__**Databases:**__`, "MongoDB \nRedis \nPostgres", true)
        .setFooter("Example: " + config.DiscordBot.Prefix + "server create NodeJS Testing Server")

    const serverName = message.content.split(' ').slice(3).join(' ') || "change me! (Settings -> SERVER NAME)";
    let consoleID = userData.get(message.author.id);

    if (consoleID == null) {
        message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID.\n" +
            "If you have not made an account yet please check out `" +
            config.DiscordBot.Prefix + "user new` to create an account \nIf you already have an account link it using `" +
            config.DiscordBot.Prefix + "user link`");
        return;
    }
    let data = serverCreateSettings.createParams(serverName, consoleID.consoleID);

    if (!args[0]) {
        //No args
        let embed = new Discord.RichEmbed()
            .addField('__**Commands**__', 'Create a server: `' + config.DiscordBot.Prefix + 'server create type servername` \nServer Types: `' + config.DiscordBot.Prefix + 'server create list` \nServer Status: `' + config.DiscordBot.Prefix + 'server status serverid` \nLink Domain`' + config.DiscordBot.Prefix + 'server proxy domainhere serveridhere ` \n Unlink domain: `' + config.DiscordBot.Prefix + 'server unproxy domainhere` \n Delete server: `' + config.DiscordBot.Prefix + 'server delete serveridhere`')
        message.channel.send(embed)

    } else if (args[0].toLowerCase() == "create") {

        //Do server creation things
        if (!args[1]) {
            message.channel.send(helpEmbed)
            return;
        }

        let types = {
            nodejs: data.nodejs,
            python: data.python,
            aio: data.aio,
            java: data.java,
            paper: data.paper,
            forge: data.forge,
            fivem: data.fivem,
            "alt:v": data.altv,
            multitheftauto: data.multitheftauto,
            "rage.mp": data.ragemp,
            "sa-mp": data.samp,
            bedrock: data.bedrock,
            pocketminemp: data.pocketminemp,
            gmod: data.gmod,
            "cs:go": data.csgo,
            "ark:se": data.arkse,
            ts3: data.ts3,
            mumble: data.mumble,
            rust: data.rust,
            mongodb: data.mongodb,
            redis: data.redis,
            postgres: data.postgres,
        }

        if (Object.keys(types).includes(args[1].toLowerCase())) {

            if (cooldown[message.author.id].nCreate > Date.now()) {
                message.reply(`You're currently on cooldown, please wait ${humanizeDuration(cooldown[message.author.id].nCreate - Date.now(), {round: true})}`)
                return;
            }
            cooldown[message.author.id].nCreate = Date.now() + (1200 * 1000)

            if (args[1] == "aio" | args[1] == "java") {
                serverCreateSettings.createServer(types[args[1].toLowerCase()])
                    .then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                            .addField(`__**Server name:**__`, serverName)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                            .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                        message.channel.send(embed)
                    }).catch(error => {
                        message.channel.send(new Discord.RichEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                    })
            } else {
                serverCreateSettings.createServer(types[args[1].toLowerCase()])
                    .then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                            .addField(`__**Server name:**__`, serverName)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        message.channel.send(new Discord.RichEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                        cooldown[message.author.id].nCreate = Date.now() + (10 * 1000)
                    })
            }
            return;
        }
        message.channel.send(helpEmbed)

    } else if (args[0].toLowerCase() == "create-donator") {

        let user = userPrem.fetch(message.author.id);
        let allowed = (message.member.roles.get('710208090741539006') != null) ? (Math.floor(user.donated / config.node7.price) + (user.boosted != null ? Math.floor(user.boosted * 2.5) : 2)) : Math.floor(user.donated / config.node7.price);
        let pServerCreatesettings = serverCreateSettings_Prem.createParams(serverName, consoleID.consoleID);

        if (allowed == 0) {
            message.channel.send("You're not a premium user, to get access to premium you can either boost us for 2 **Premium Servers**, or buy a server (1server/$1)")
            return;
        }

        if ((allowed - user.used) <= 0) {
            message.channel.send("You are at your premium server limit")
            return;
        }
        //Do server creation things
        if (!args[1]) {
            message.channel.send(new Discord.RichEmbed()
                .setColor(`RED`).setDescription(`List of servers: (use ${config.DiscordBot.Prefix}server create <type> <name>)`)
                .addField(`__**Bots:**__`, "NodeJS \nPython \nJava \naio", true)
                .addField(`__**Databases:**__`, "MongoDB \nRedis \nPostgres", true)
                .setFooter("Example: " + config.DiscordBot.Prefix + "server create NodeJS Testing Server"))
            return;
        }

        if (cooldown[message.author.id].pCreate > Date.now()) {
            message.reply(`You're currently on cooldown, please wait ${humanizeDuration(cooldown[message.author.id].pCreate - Date.now(), {round: true})}`)
            return;
        }
        cooldown[message.author.id].pCreate = Date.now() + (10 * 1000);


        let types = {
            nodejs: pServerCreatesettings.nodejs,
            python: pServerCreatesettings.python,
            aio: pServerCreatesettings.aio,
            java: pServerCreatesettings.java,
            mongodb: pServerCreatesettings.mongodb,
            redis: pServerCreatesettings.redis,
            postgres: pServerCreatesettings.postgres,
        }

        if (Object.keys(types).includes(args[1].toLowerCase())) {
            serverCreateSettings_Prem.createServer(types[args[1].toLowerCase()])
                .then(response => {

                    userPrem.set(message.author.id + '.used', userPrem.fetch(message.author.id).used + 1);

                    let embed = new Discord.RichEmbed()
                        .setColor(`GREEN`)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                        .addField(`__**Node:**__`, "Node 7 - Boosters/Donators")
                        .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                    message.channel.send(embed)

                    let embed2 = new Discord.RichEmbed()
                        .setTitle('New donator node server created!')
                        .addField('User:', message.author.id)
                        .addField(`__**Status:**__`, response.statusText)
                        .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                        .addField(`__**Server name:**__`, serverName)
                        .addField(`__**Type:**__`, args[1].toLowerCase())
                        .setFooter('User has ' + (user.used + 1) + ' out of a max ' + allowed + ' servers')
                    client.channels.get("785236066500083772").send(embed2)

                }).catch(error => {
                    message.channel.send(new Discord.RichEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                })
            return;
        }

        message.channel.send(new Discord.RichEmbed()
            .setColor(`RED`).setDescription(`List of servers: (use ${config.DiscordBot.Prefix}server create <type> <name>)`)
            .addField(`__**Bots:**__`, "NodeJS \nPython \nJava \naio", true)
            .addField(`__**Databases:**__`, "MongoDB \nRedis \nPostgres", true)
            .setFooter("Example: " + config.DiscordBot.Prefix + "server create NodeJS Testing Server"))


    } else if (args[0].toLowerCase() == "delete") {

        if (cooldown[message.author.id].delete > Date.now()) {
            message.reply(`You're currently on cooldown, please wait ${humanizeDuration(cooldown[message.author.id].delete - Date.now(), {round: true})}`)
            return;
        }
        cooldown[message.author.id].delete = Date.now() + (3 * 1000);

        //delete server things
        if (!args[1]) {
            message.channel.send('Command format: `' + config.DiscordBot.Prefix + 'server delete serveridhere`')
        } else {
            message.channel.send('Checking server `' + args[1] + '`\nPlease allow me 2seconds to fetch this.').then((msg) => {
                axios({
                    url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(message.author.id).consoleID + "?include=servers",
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(response => {
                    const preoutput = response.data.attributes.relationships.servers.data
                    const output = preoutput.find(srv => srv.attributes ? srv.attributes.identifier == args[1] : false)


                    setTimeout(async () => {
                        setTimeout(() => {
                            if (!output) {
                                msg.edit('Can\'t find that server :(')
                            } else {

                                if (output.attributes.user == userData.get(message.author.id).consoleID) {
                                    msg.edit('Are you sure you want to delete `' + output.attributes.name + '`?\nPlease type `confirm` to delete this server. You have 1min until this will expire \n\n**You can not restore the server once it has been deleted and/or its files**')
                                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                        time: 60000,
                                        max: 2
                                    });
                                    collector.on('collect', message => {
                                        if (message == "confirm") {
                                            message.delete()
                                            msg.edit('Working...')
                                            axios({
                                                url: config.Pterodactyl.hosturl + "/api/application/servers/" + output.attributes.id + "/force",
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

                                                if (output.attributes.node == 14)
                                                    userPrem.set(message.author.id + '.used', userPrem.fetch(message.author.id).used - 1);

                                                collector.stop()
                                            }).catch(err => {
                                                msg.edit('Error with the node. Please try again later')
                                                collector.stop()
                                            });
                                        } else {
                                            message.delete()
                                            msg.edit('Request cancelled!')
                                            collector.stop()
                                        }
                                    })

                                } else {
                                    message.channel.send('You do not own that server. You cant delete it.')
                                }
                            }
                        }, 500)
                    }, 1000)
                });
            });
        }
    } else if (args[0].toLowerCase() == "manage") {
        message.channel.send('Uh this isnt done yet...')
    } else if (args[0] == "list") {
        message.channel.send('Loading servers...')
        //List servers
        var arr = [];
        axios({
            url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(message.author.id).consoleID + "?include=servers",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            const preoutput = response.data.attributes.relationships.servers.data
            //console.log(resources.data.meta)
            arr.push(...preoutput)
            setTimeout(async () => {
                //console.log(arr.length)
                console.log(arr)
                setTimeout(() => {
                    var clean = arr.map(e => "Server Name: `" + e.attributes.name + "`, Server ID: `" + e.attributes.identifier + "`\n")
                    const embed = new Discord.RichEmbed()
                        .addField('__**Your Servers:**__', clean)
                    message.channel.send(embed)
                    //console.log(output)
                }, 500)
            }, 5000)
        });
    } else if (args[0].toLowerCase() == "status") {
        if (!args[1]) {
            let embed = new Discord.RichEmbed()
                .setColor(`GREEN`)
                .addField(`__**Server Status**__`, 'What server would you like to view? Please type: `' + config.DiscordBot.Prefix + 'server status serverid`', true)
            message.channel.send(embed)
        } else {
            message.channel.send('Fetching server...')
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
                })
            }).catch(error => {
                message.channel.send('Server not found')
            });
        }
    } else if (args[0].toLowerCase() == "proxy") {
        const embed = new Discord.RichEmbed()
            .setTitle('__**How to link a domain to a website/server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server proxy domainhere serverid')
        if (!args[1]) {
            message.channel.send(embed)
        } else {
            if (!args[2]) {
                message.channel.send(embed)
            } else {

                axios({
                    url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(message.author.id).consoleID + "?include=servers",
                    method: 'GET',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    }
                }).then(use => {
                    use = use.data.attributes;

                    if (use.relationships) {
                        let k = Object.keys(use.relationships);
                        use.extras = {};
                        k.forEach(key => {
                            if (use.relationships[key].data != null)
                                use.extras[key] = use.relationships[key].data.map(a => a.attributes);
                            else
                                use.extras[key] = use.relationships[key];
                        })
                        delete use.relationships;
                    }

                    if (use.extras.servers == null || use.extras.servers.find(x => x.identifier == args[2]) == null) {
                        message.channel.send("Couldn't find that server in your server list.")
                        return;
                    }

                    message.channel.send('Please give me a few seconds. Trying to link that domain!')
                    //SSH Connection
                    ssh.connect({
                        host: config.SSH.Host,
                        username: config.SSH.User,
                        port: config.SSH.Port,
                        password: config.SSH.Password,
                        tryKeyboard: true,
                    })

                    //Copy template file. Ready to be changed!
                    fs.access(path.resolve(path.dirname(require.main.filename), "proxy/" + args[1].toLowerCase() + ".conf"), fs.constants.R_OK, (err) => {
                        if (!err) {
                            return message.channel.send("This domain has been linked before or is currently linked..")
                        } else {
                            fs.copyFile(path.resolve('./proxy/template.txt'), './proxy/' + args[1] + '.conf', (err) => {
                                if (err) {
                                    console.log("Error Found:", err);
                                }
                            })
                            fs.copyFile(path.resolve('./proxy/template.txt'), './proxy/' + args[1] + '.conf', (err) => {
                                if (err) {
                                    console.log("Error Found:", err);
                                }
                            })

                            setTimeout(() => {
                                //Change Domain
                                var z = 0;
                                while (z < 5) {
                                    const domainchange = rif.sync({
                                        files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                        from: "REPLACE-DOMAIN",
                                        to: args[1].toLowerCase(),
                                        countMatches: true,
                                    });
                                    z++
                                }

                                //Grab node and port ready for the config 
                                axios({
                                    url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[2],
                                    method: 'GET',
                                    followRedirect: true,
                                    maxRedirects: 5,
                                    headers: {
                                        'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                                        'Content-Type': 'application/json',
                                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                                    }
                                }).then(response => {
                                    const node = response.data.attributes.node;
                                    console.log(node)
                                    const port = response.data.attributes.relationships.allocations.data[0].attributes.port
                                    if (node === "Node 1") {

                                        //Change Server IP
                                        setTimeout(() => {
                                            var y = 0;
                                            while (y < 3) {
                                                const ipchange = rif.sync({
                                                    files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                    from: "REPLACE-IP",
                                                    to: "154.27.68.105",
                                                    countMatches: true,
                                                });
                                                y++
                                            };

                                            //Change Server Port
                                            setTimeout(() => {
                                                var x = 0;
                                                while (x < 3) {
                                                    const portchange = rif.sync({
                                                        files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                        from: "REPLACE-PORT",
                                                        to: port,
                                                        countMatches: true,
                                                    });
                                                    x++
                                                }
                                            }, 100) //END - Change Server Port
                                        }, 100) //END - Change Server IP
                                    } else if (node === "Node 2") {

                                        //Change Server IP
                                        setTimeout(() => {
                                            var y = 0;
                                            while (y < 3) {
                                                const ipchange = rif.sync({
                                                    files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                    from: "REPLACE-IP",
                                                    to: "154.27.68.106",
                                                    countMatches: true,
                                                });
                                                y++
                                            };

                                            //Change Server Port
                                            setTimeout(() => {
                                                var x = 0;
                                                while (x < 3) {
                                                    const portchange = rif.sync({
                                                        files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                        from: "REPLACE-PORT",
                                                        to: port,
                                                        countMatches: true,
                                                    });
                                                    x++
                                                }
                                            }, 100) //END - Change Server Port
                                        }, 100) //END - Change Server IP
                                    } else if (node === "Node 5") {

                                        //Change Server IP
                                        setTimeout(() => {
                                            var y = 0;
                                            while (y < 3) {
                                                const ipchange = rif.sync({
                                                    files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                    from: "REPLACE-IP",
                                                    to: "154.27.68.108",
                                                    countMatches: true,
                                                });
                                                y++
                                            };

                                            //Change Server Port
                                            setTimeout(() => {
                                                var x = 0;
                                                while (x < 3) {
                                                    const portchange = rif.sync({
                                                        files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                        from: "REPLACE-PORT",
                                                        to: port,
                                                        countMatches: true,
                                                    });
                                                    x++
                                                }
                                            }, 100) //END - Change Server Port
                                        }, 100) //END - Change Server IP
                                    } else if (node === "Node 7") {

                                        //Change Server IP
                                        setTimeout(() => {
                                            var y = 0;
                                            while (y < 3) {
                                                const ipchange = rif.sync({
                                                    files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                    from: "REPLACE-IP",
                                                    to: "154.27.68.110",
                                                    countMatches: true,
                                                });
                                                y++
                                            };

                                            //Change Server Port
                                            setTimeout(() => {
                                                var x = 0;
                                                while (x < 3) {
                                                    const portchange = rif.sync({
                                                        files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                        from: "REPLACE-PORT",
                                                        to: port,
                                                        countMatches: true,
                                                    });
                                                    x++
                                                }
                                            }, 100) //END - Change Server Port
                                        }, 100) //END - Change Server IP
                                    } else {
                                        message.channel.send('Unsupported node. Stopping reverse proxy.')
                                        fs.unlinkSync("./proxy/" + args[1] + ".conf");
                                    }


                                    //Upload file to /etc/apache2/sites-available
                                    setTimeout(() => {
                                        ssh.putFile('/root/DBH/Panel/proxy/' + args[1] + '.conf', '/etc/apache2/sites-available/' + args[1] + ".conf").then(function () {

                                            //Run command to genate SSL cert.
                                            ssh.execCommand(`certbot certonly -d ${args[1]} --non-interactive --webroot --webroot-path /var/www/html --agree-tos -m danielpd93@gmail.com`, {
                                                cwd: '/root'
                                            }).then(function (result) {
                                                if (result.stdout.includes('Congratulations!')) {
                                                    //No error. Continue to enable site on apache2 then restart
                                                    console.log('SSL Gen complete. Continue!')

                                                    ssh.execCommand(`a2ensite ${args[1]} && service apache2 restart`, {
                                                        cwd: '/root'
                                                    }).then(function (result) {
                                                        //Complete
                                                        message.reply('Domain has now been linked!')
                                                        let data = userData.get(message.author.id).domains || []
                                                        userData.set(message.author.id + '.domains', [...new Set(data), {
                                                            domain: args[1].toLowerCase(),
                                                            serverID: args[2],
                                                        }]);
                                                    })
                                                } else if (result.stdout.includes('Certificate not yet due for renewal')) {
                                                    //No error. Continue to enable site on apache2 then restart
                                                    console.log('SSL Gen complete. Continue!')

                                                    ssh.execCommand(`a2ensite ${args[1]} && service apache2 restart`, {
                                                        cwd: '/root'
                                                    }).then(function (result) {
                                                        //Complete
                                                        message.reply('Domain has now been linked!')

                                                        let data = userData.get(message.author.id).domains || []
                                                        userData.set(message.author.id + '.domains', [...new Set(data), {
                                                            domain: args[1].toLowerCase(),
                                                            serverID: args[2],
                                                        }]);
                                                    })
                                                } else {
                                                    message.channel.send('Error making SSL cert. Either the domain is not pointing to `154.27.68.95` or cloudflare proxy is enabled!\n\n' +
                                                        '**If you have just done this after running the command. Please give the bot 5 - 10mins to refresh the DNS cache** \n\nFull Error: ```' + result.stdout + '```')
                                                    fs.unlinkSync("./proxy/" + args[1] + ".conf");
                                                }
                                            })
                                        }, function (error) {
                                            //If error exists. Error and delete proxy file
                                            fs.unlinkSync("./proxy/" + args[1] + ".conf");
                                            message.channel.send("FAILED \n" + error);
                                        })
                                    }, 250) //END - Upload file to /etc/apache2/sites-available
                                }).catch(err => {
                                    message.channel.send('Can\'t find that server :( ')
                                    fs.unlinkSync("./proxy/" + args[1] + ".conf");
                                }) //END - Grab server info (Node and Port)
                            }, 250) //END - //Change Domain
                        }
                    })
                })
            }
        }
    } else if (args[0].toLowerCase() == "unproxy") {
        if (!args[1]) {
            const embed = new Discord.RichEmbed()
                .setTitle('__**How to remove a domain from a server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server unproxy domainhere')
            message.channel.send(embed)
        } else {

            if (userData.get(message.author.id).domains.find(x => x.domain == args[1].toLowerCase()) == null) {
                message.channel.send("that domain isnt linked.")
                return;
            }

            //SSH Connection
            ssh.connect({
                host: config.SSH.Host,
                username: config.SSH.User,
                port: config.SSH.Port,
                password: config.SSH.Password,
                tryKeyboard: true,
            })

            //Delete file from apache2 dir
            ssh.execCommand('a2dissite ' + args[1] + ' && rm /etc/apache2/sites-available/' + args[1] + '.conf && rm -rf /etc/letsencrypt/live/' + args[1] + ' && rm -rf /etc/letsencrypt/archive' + args[1] + '&& service apache2 restart', {
                cwd: '/root'
            })
            fs.unlinkSync("./proxy/" + args[1] + ".conf");

            userData.set(message.author.id + '.domains', userData.get(message.author.id).domains.filter(x => x.domain != args[1].toLowerCase()));

            message.channel.send('Proxy has been removed from ' + args[1])
        }

    } else if (args[0].toLowerCase() == "move") {
        /*
        const eggs_to_names = {
            "16": "nodejs",
            "22": "python",
            "46": "aio",
            "25": "java",
            "3" : "paper",
            "2" : "forge",
            "26": "fivem",
            "42": "altv",
            "43": "multitheftauto",
            "44": "ragemp",
            "45": "samp",
            "18": "bedrock",
            "28": "pocketminemp",
            "9" : "gmod",
            "7" : "csgo",
            "6" : "arkse",
            "13": "ts3",
            "12": "mumble",
            "14": "rust",
            "35": "mongodb",
            "36": "redis",
            "37": "postgres"
        }
        if (!args[1]) {
            message.channel.send("Command format: `" + config.DiscordBot.Prefix + "server move serverid node`")
        } else {
            if (userPrem.fetch(message.author.id + ".premium")) {
                if (userPrem.fetch(message.author.id + ".current") > userPrem.fetch(message.author.id + ".max")) {
                    message.channel.send("You are at your premium server limit")
                } else {
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[2],
                        method: 'GET',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        }
                    }).then(response => {
                        if (response.data.attributes.node == "Node 1") {
                            axios({
                                url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(message.author.id + ".consoleID") + "?include=servers",
                                method: 'GET',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                                    'Content-Type': 'application/json',
                                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                                }
                            }).then(response => {
                                if (Object.keys(types).includes(args[1].toLowerCase())) {
                                    if(args[1] == "aio" | args[1] == "java") {
                                        serverCreateSettings_Prem.createServer()
                                        .then(response => {
                                            let embed = new Discord.RichEmbed()
                                                .setColor(`GREEN`)
                                                .addField(`__**Status:**__`, response.statusText)
                                                .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                                                .addField(`__**Server name:**__`, serverName)
                                                .addField(`__**Type:**__`, args[1].toLowerCase())
                                                .addField(`__**WARNING**__`, `**DO NOT USE JAVA TO RUN GAMESERVERS. IF THERE IS A GAME YOU ARE WANTING TO HOST AND IT DOES NOT HAVE A SERVER PLEASE MAKE A TICKET**`)
                                            message.channel.send(embed)
                                        }).catch(error => {
                                            message.channel.send(new Discord.RichEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                                            console.log(error)
                                        })
                                    } else {
                                        serverCreateSettings.createServer(types[args[1].toLowerCase()])
                                        .then(response => {
                                            let embed = new Discord.RichEmbed()
                                                .setColor(`GREEN`)
                                                .addField(`__**Status:**__`, response.statusText)
                                                .addField(`__**Created for user ID:**__`, consoleID.consoleID)
                                                .addField(`__**Server name:**__`, serverName)
                                                .addField(`__**Type:**__`, args[1].toLowerCase())
                                            message.channel.send(embed)
                                        }).catch(error => {
                                            message.channel.send(new Discord.RichEmbed().setColor(`RED`).addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`"))
                                            console.log(error)
                                        })
                                    }
                                    return;
                                }
                                message.channel.send(helpEmbed)
                                
                            })
                            //SSH Connection
                            ssh.connect({
                                host: "154.27.68.232",
                                username: "root",
                                port: "22",
                                tryKeyboard: true,
                            });
                            ssh.execCommand('', {
                                cwd: '/root'
                            })
                        } else if (response.data.attributes.node == "Node 2 ") {

                        }
                    })
                }
    
            } else {
                message.channel.send('Sorry but this command is not ready yet')
            }
        }*/
    }
};