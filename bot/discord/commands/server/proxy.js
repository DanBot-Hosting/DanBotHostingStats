const sshClient = require('ssh2').Client;
const axios = require('axios');
exports.run = async(client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('__**How to link a domain to a website/server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server proxy domain serverid')
    if (!args[1]) {
        await message.channel.send(embed)
    } else {
        if (!args[2]) {
            await message.channel.send(embed)
        } else {
            if (args[1].toLowerCase().includes('only-fans.club')) {
                if (message.member.roles.cache.some(r => ['898041754564046869', '710208090741539006'].includes(r.id))) {
                    const linkalready = userData.fetchAll().filter(users => users.data.domains && users.data.domains.filter(x => x.domain === args[1]).length != 0);
                    if (linkalready[0]) {
                        message.channel.send('Domain is already linked')
                    } else {
                        axios({
                            url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID + "?include=servers",
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
                                message.channel.send("Couldn't find that server in your server list. \nDo you own that server?")
                                return;
                            }
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

                                message.reply('Please give me a few seconds! \nProcess: Connecting to SSH...').then(sentmsg => {

                                    //SSH Connection
                                    let conn = new sshClient();
                                    conn.on('ready', function() {
                                        console.log('SSH: ready');
                                        sentmsg.edit('Please give me a few seconds! \nProcess: SSH connected. \nNext: Making SSL cert... **This will take a few seconds**')
                                    }).connect({
                                        host: config.SSH.Host,
                                        port: config.SSH.Port,
                                        username: config.SSH.User,
                                        password: config.SSH.Password
                                    });

                                    conn.on('ready', function() {
                                        conn.exec('certbot certonly -d ' + args[1] + ' --non-interactive --webroot --webroot-path /var/www/html --agree-tos -m proxy@danbot.host', function(err, stream) {
                                            if (err) throw err;
                                            stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                if (data.includes("Congratulations!")) {
                                                    sentmsg.edit('Please give me a few seconds! \nProcess: SSL Complete. \nNext: Write proxy file. **Sometimes this gets stuck, If it takes more than 10seconds run the command again**')
                                                    conn.exec(`echo "<VirtualHost *:80>
                                               ServerName ${args[1]}
                                               RewriteEngine On
                                               RewriteCond %{HTTPS} !=on
                                               RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L] 
                                             </VirtualHost>
                                             <VirtualHost *:443>
                                               ServerName ${args[1]}
                                                 ProxyRequests off
                                                 SSLProxyEngine on
                                                 ProxyPreserveHost On
                                               SSLEngine on
                                               SSLCertificateFile /etc/letsencrypt/live/${args[1].toLowerCase()} /fullchain.pem
                                               SSLCertificateKeyFile /etc/letsencrypt/live/${args[1].toLowerCase()}/privkey.pem
                                             
                                                 <Location />
                                                     ProxyPass http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                     ProxyPassReverse http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                 </Location>
                                             </VirtualHost>" > /etc/apache2/sites-enabled/${args[1]}.conf && sleep 1 && echo "complete`, function(err, stream) {
                                                        if (err) throw err;
                                                        stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                            sentmsg.edit('Please give me a few seconds! \nProcess: Proxy file written. \nNext: Reload webserver.')
                                                            //console.log('STDOUT: ' + data);
                                                            setTimeout(() => {
                                                                conn.exec('service apache2 restart && echo "complete', function(err, stream) {
                                                                    if (err) throw err;
                                                                    stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                                        sentmsg.edit('Domain linking complete!')
                                                                        let datalmao = userData.get(message.author.id).domains || []
                                                                        userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                                                                            domain: args[1].toLowerCase(),
                                                                            serverID: args[2],
                                                                        }]);
                                                                        conn.end()
                                                                        //console.log('STDOUT: ' + data);
                                                                    })
                                                                });
                                                            })
                                                        });

                                                    }, 2000)
                                                } else if (data.includes("Certificate not yet due for renewal")) {
                                                    sentmsg.edit('Please give me a few seconds! \nProcess: SSL Complete. \nNext: Write proxy file. **Sometimes this gets stuck, If it takes more than 10seconds run the command again**')
                                                    conn.exec(`echo  "<VirtualHost *:80>
                                               ServerName ${args[1]}
                                               RewriteEngine On
                                               RewriteCond %{HTTPS} !=on
                                               RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L] 
                                             </VirtualHost>
                                             <VirtualHost *:443>
                                               ServerName ${args[1]}
                                                 ProxyRequests off
                                                 SSLProxyEngine on
                                                 ProxyPreserveHost On
                                               SSLEngine on
                                               SSLCertificateFile /etc/letsencrypt/live/${args[1].toLowerCase()}/fullchain.pem
                                               SSLCertificateKeyFile /etc/letsencrypt/live/${args[1].toLowerCase()}/privkey.pem
                                             
                                                 <Location />
                                                     ProxyPass http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                     ProxyPassReverse http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                 </Location>
                                             </VirtualHost> " > /etc/apache2/sites-enabled/${args[1]}.conf && sleep 1 && echo "complete"`, function(err, stream) {
                                                        if (err) throw err;
                                                        stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                            sentmsg.edit('Please give me a few seconds! \nProcess: Proxy file written. \nNext: Reload webserver.')
                                                            //console.log('STDOUT: ' + data);
                                                            setTimeout(() => {
                                                                conn.exec('service apache2 restart && echo "complete"', function(err, stream) {
                                                                    if (err) throw err;
                                                                    stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                                        sentmsg.edit('Domain linking complete!')
                                                                        let datalmao = userData.get(message.author.id).domains || []
                                                                        userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                                                                            domain: args[1].toLowerCase(),
                                                                            serverID: args[2],
                                                                        }]);
                                                                        conn.end()
                                                                        //console.log('STDOUT: ' + data);
                                                                    })
                                                                });
                                                            })
                                                        });

                                                    }, 2000)
                                                } else {
                                                    sentmsg.edit('ERROR, SSL failed to connect. Is your domain pointing to the correct ip address? \nReverse Proxy ip is: `' + config.SSH.Host + '`')
                                                }
                                                //console.log('STDOUT: ' + data);
                                            })
                                        });
                                    })
                                })
                            })
                        })
                    }
                } else {
                    message.channel.send('Sorry, only-fans.club subdomains are only available for boosters and donators. ')
                }
            } else {
                const linkalready = userData.fetchAll().filter(users => users.data.domains && users.data.domains.filter(x => x.domain === args[1]).length != 0);
                if (linkalready[0]) {
                    message.channel.send('Domain is already linked')
                } else {
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/users/" + userData.get(message.author.id).consoleID + "?include=servers",
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
                            message.channel.send("Couldn't find that server in your server list. \nDo you own that server?")
                            return;
                        }
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

                            message.reply('Please give me a few seconds! \nProcess: Connecting to SSH...').then(sentmsg => {

                                //SSH Connection
                                let conn = new sshClient();
                                conn.on('ready', function() {
                                    console.log('SSH: ready');
                                    sentmsg.edit('Please give me a few seconds! \nProcess: SSH connected. \nNext: Making SSL cert... **This will take a few seconds**')
                                }).connect({
                                    host: config.SSH.Host,
                                    port: config.SSH.Port,
                                    username: config.SSH.User,
                                    password: config.SSH.Password
                                });

                                conn.on('ready', function() {
                                    conn.exec('certbot certonly -d ' + args[1] + ' --non-interactive --webroot --webroot-path /var/www/html --agree-tos -m proxy@danbot.host', function(err, stream) {
                                        if (err) throw err;
                                        stream.on('close', function(code, signal) {}).on('data', function(data) {
                                            if (data.includes("Congratulations!")) {
                                                sentmsg.edit('Please give me a few seconds! \nProcess: SSL Complete. \nNext: Write proxy file. **Sometimes this gets stuck, If it takes more than 10seconds run the command again**')
                                                conn.exec(`echo "<VirtualHost *:80>
                                               ServerName ${args[1]}
                                               RewriteEngine On
                                               RewriteCond %{HTTPS} !=on
                                               RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L] 
                                             </VirtualHost>
                                             <VirtualHost *:443>
                                               ServerName ${args[1]}
                                                 ProxyRequests off
                                                 SSLProxyEngine on
                                                 ProxyPreserveHost On
                                               SSLEngine on
                                               SSLCertificateFile /etc/letsencrypt/live/${args[1].toLowerCase()} /fullchain.pem
                                               SSLCertificateKeyFile /etc/letsencrypt/live/${args[1].toLowerCase()}/privkey.pem
                                             
                                                 <Location />
                                                     ProxyPass http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                     ProxyPassReverse http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                 </Location>
                                             </VirtualHost>" > /etc/apache2/sites-enabled/${args[1]}.conf && sleep 1 && echo "complete`, function(err, stream) {
                                                    if (err) throw err;
                                                    stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                        sentmsg.edit('Please give me a few seconds! \nProcess: Proxy file written. \nNext: Reload webserver.')
                                                        //console.log('STDOUT: ' + data);
                                                        setTimeout(() => {
                                                            conn.exec('service apache2 restart && echo "complete', function(err, stream) {
                                                                if (err) throw err;
                                                                stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                                    sentmsg.edit('Domain linking complete!')
                                                                    let datalmao = userData.get(message.author.id).domains || []
                                                                    userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                                                                        domain: args[1].toLowerCase(),
                                                                        serverID: args[2],
                                                                    }]);
                                                                    conn.end()
                                                                    //console.log('STDOUT: ' + data);
                                                                })
                                                            });
                                                        })
                                                    });

                                                }, 2000)
                                            } else if (data.includes("Certificate not yet due for renewal")) {
                                                sentmsg.edit('Please give me a few seconds! \nProcess: SSL Complete. \nNext: Write proxy file. **Sometimes this gets stuck, If it takes more than 10seconds run the command again**')
                                                conn.exec(`echo  "<VirtualHost *:80>
                                               ServerName ${args[1]}
                                               RewriteEngine On
                                               RewriteCond %{HTTPS} !=on
                                               RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R,L] 
                                             </VirtualHost>
                                             <VirtualHost *:443>
                                               ServerName ${args[1]}
                                                 ProxyRequests off
                                                 SSLProxyEngine on
                                                 ProxyPreserveHost On
                                               SSLEngine on
                                               SSLCertificateFile /etc/letsencrypt/live/${args[1].toLowerCase()}/fullchain.pem
                                               SSLCertificateKeyFile /etc/letsencrypt/live/${args[1].toLowerCase()}/privkey.pem
                                             
                                                 <Location />
                                                     ProxyPass http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                     ProxyPassReverse http://${response.data.attributes.sftp_details.ip}:${response.data.attributes.relationships.allocations.data[0].attributes.port}/
                                                 </Location>
                                             </VirtualHost> " > /etc/apache2/sites-enabled/${args[1]}.conf && sleep 1 && echo "complete"`, function(err, stream) {
                                                    if (err) throw err;
                                                    stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                        sentmsg.edit('Please give me a few seconds! \nProcess: Proxy file written. \nNext: Reload webserver.')
                                                        //console.log('STDOUT: ' + data);
                                                        setTimeout(() => {
                                                            conn.exec('service apache2 restart && echo "complete"', function(err, stream) {
                                                                if (err) throw err;
                                                                stream.on('close', function(code, signal) {}).on('data', function(data) {
                                                                    sentmsg.edit('Domain linking complete!')
                                                                    let datalmao = userData.get(message.author.id).domains || []
                                                                    userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                                                                        domain: args[1].toLowerCase(),
                                                                        serverID: args[2],
                                                                    }]);
                                                                    conn.end()
                                                                    //console.log('STDOUT: ' + data);
                                                                })
                                                            });
                                                        })
                                                    });

                                                }, 2000)
                                            } else {
                                                sentmsg.edit('ERROR, SSL failed to connect. Is your domain pointing to the correct ip address? \nReverse Proxy ip is: `' + config.SSH.Host + '`')
                                            }
                                            //console.log('STDOUT: ' + data);
                                        })
                                    });
                                })
                            })
                        })
                    })
                }
            }
        }
    }
}
