const sshClient = require('ssh2').Client;
exports.run = async (client, message, args, cooldown) => {
    const embed = new Discord.MessageEmbed()
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

                if (use.extras.servers == null || use.extras.servers.find(x => x.identifier === args[2]) == null) {
                    message.channel.send("Couldn't find that server in your server list.")
                    return;
                }

                const sentmsg = message.channel.send('Please give me a few seconds! \nProcess: Connecting to SSH...')
                //SSH Connection
                let conn = new sshClient();
                conn.on('ready', function() {
                    console.log('SSH: ready');
                    sentmsg.edit('Please give me a few seconds! \nProcess: SSH connected...')
                }).connect({
                    host: config.SSH.Host,
                    port: config.SSH.Port,
                    username: config.SSH.User,
                    password: config.SSH.Password
                });

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
                                } else if (node === "Node 6") {

                                    //Change Server IP
                                    setTimeout(() => {
                                        var y = 0;
                                        while (y < 3) {
                                            const ipchange = rif.sync({
                                                files: '/root/DBH/Panel/proxy/' + args[1] + '.conf',
                                                from: "REPLACE-IP",
                                                to: "194.146.44.170",
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
                                        ssh.execCommand(`certbot certonly -d ${args[1]} --non-interactive --webroot --webroot-path /var/www/html --agree-tos -m rp@danbot.host`, {
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
}