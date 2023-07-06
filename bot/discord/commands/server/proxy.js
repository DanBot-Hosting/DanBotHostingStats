const axios = require('axios');
const dns = require('dns');

async function getNewKeyFR() {
    const serverRes = await axios({
        url: config.FRProxy.url + "/api/tokens",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "identity": config.FRProxy.email,
            "secret": config.FRProxy.pass
        }
    });
    return "Bearer " + serverRes.data.token;
}

async function getNewKeyCA() {
    const serverRes = await axios({
        url: config.CAProxy.url + "/api/tokens",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "identity": config.CAProxy.email,
            "secret": config.CAProxy.pass
        }
    });
    return "Bearer " + serverRes.data.token;
}

async function getNewKeyDonator() {
    const serverRes = await axios({
        url: config.DonatorProxy.url + "/api/tokens",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "identity": config.DonatorProxy.email,
            "secret": config.DonatorProxy.pass
        }
    });
    return "Bearer " + serverRes.data.token;
}

exports.run = async (client, message, args) => {

    const embed = new Discord.MessageEmbed()
        .setTitle('**DanBot Hosting Proxy System')
        .setDescription('The DanBot Hosting proxy systems allows users to proxy their domains to their servers with simple commands.\n\n' +
        'The command format: `' + config.DiscordBot.Prefix + 'server proxy <Domain> <serverId>`' + 
        'You can link a domain by first creating a DNS A record, pointed towards one of the following proxies:\n\n' +
        '`164.132.74.251` [FRANCE]\n' + '`192.95.42.75` [CANADA]' + '`5.196.239.158` [Donator Exclusive]\n\n' +
        'If you are using Cloudflare, make sure you are using DNS only mode, and disabling always use HTTPS.' +
        'Donators can use the `*.only-fans.club` subdomains! Replace <Domain> with the subdomain.only-fans.club to use it! Please note these domains are proxied through France, and will not work if France is disabled.'
        );
        .setColor('BLUE');

        /*
        .setDescription('`' + config.DiscordBot.Prefix + 'server proxy <domain> <serverid>`' +
            '\nMake sure to replace <domain> with your domain and <serverid> with the ID of your server. ' +
            'You can find your server id by running `' + config.DiscordBot.Prefix + 'server list`' +
            '\nYou can link your own domain by creating a DNS A Record pointing either \`164.132.74.251\` or \`192.95.42.75\`! [DISABLED]' +
            '\nIf you are a donator, you have the option to use the donator proxy \`5.196.239.158\`! ' +
            '\nIf you are using Cloudflare make sure the you are using DNS only mode!' +
            '\nFor donators there is the free domain `*.only-fans.club`.');
        */

    if (!args[1] || !args[2]) {
        await message.channel.send(embed);
    } else {
        
        if (args[1].toLowerCase().includes('only-fans.club')) {
            if (!message.member.roles.cache.some(r => ['898041754564046869', '710208090741539006'].includes(r.id))) return message.channel.send('Sorry, only-fans.club subdomains are only available for boosters and donators.');
        };

        const linkalready = userData.fetchAll().filter(users => users.data.domains && users.data.domains.filter(x => x.domain === args[1]).length != 0);
        if (linkalready[0]) {
            return message.channel.send('Domain is already linked.');
        };

        if (!/^[a-zA-Z0-9.-]+$/.test(args[1]) || args[1].length > 253) { //Check the provided domain is a valid domain
            return message.channel.send('That is not a valid domain! \nExample of domains:\nValid: danbot.host\nInvalid: <https://danbot.host/>');
        };

        const dnsCheck = await new Promise((res, rej) => {
            const options = {
                // Setting family as 6 i.e. IPv6
                family: 4,
                hints: dns.ADDRCONFIG | dns.V4MAPPED,
            };

            dns.lookup(args[1], options, (err, address, family) =>
                res({err, address, family})
            );
        });

        if(!["164.132.74.251", "192.95.42.75", "5.196.239.158"].includes(dnsCheck.address)) {
            return message.channel.send('ERROR: You must have a DNS A Record pointing to \`164.132.74.251\` or \`192.95.42.75\` or \`5.196.239.158\`! Also if you are using Cloudflare make sure the you are using DNS Only mode!\nIf you have done all of that and it\'s still not working: Try again later, because sometimes DNS changes can take a while to update. (Can take up to 24 hours to update!)');
        };
    
        if(["164.132.74.251", "192.95.42.75"].includes(dnsCheck.address)) {
            return message.channel.send('Canada and France Proxy locations have been disabled until further notice.');
        };

        if (!message.member.roles.cache.some(r => ['898041754564046869', '710208090741539006'].includes(r.id)) && "5.196.239.158" == dnsCheck.address) return message.channel.send('Sorry, this proxy location is only available for boosters and donators.');

        //config.FRProxy.authKey = await getNewKeyFR();
        //config.CAProxy.authKey = await getNewKeyCA();
        config.DonatorProxy.authKey = await getNewKeyDonator();

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
            };

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
                message.reply('Proxying your domain... This can take up to 30 seconds.');

                if(dnsCheck.address == "164.132.74.251") { //France
                    message.channel.send("Domain found on France...");
                    axios({
                        url: config.FRProxy.url + "/api/nginx/proxy-hosts",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': config.FRProxy.authKey,
                            'Content-Type': 'application/json',
                        },
                        data: {
                            "domain_names": [
                                args[1].toLowerCase()
                            ],
                            "forward_scheme": "http",
                            "forward_host": response.data.attributes.sftp_details.ip,
                            "forward_port": response.data.attributes.relationships.allocations.data[0].attributes.port,
                            "access_list_id": "0",
                            "certificate_id": "new",
                            "meta": {
                                "letsencrypt_email": "proxy-renew@danbot.host",
                                "letsencrypt_agree": true,
                                "dns_challenge": false
                            },
                            "advanced_config": "",
                            "locations": [],
                            "block_exploits": false,
                            "caching_enabled": false,
                            "allow_websocket_upgrade": true,
                            "http2_support": false,
                            "hsts_enabled": false,
                            "hsts_subdomains": false,
                            "ssl_forced": true
                        }
                    }).then(ResponseAfterProxy => {
                        //console.log(chalk.blue('DEBUG: ' + chalk.white(ResponseAfterProxy))
                        message.reply("Domain has been proxied, Its ID is: " + ResponseAfterProxy.data.id)
                        let datalmao = userData.get(message.author.id).domains || []
                        userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                            domain: args[1].toLowerCase(),
                            serverID: args[2],
                            location: "FR"
                        }]);

                    }).catch(ErrorAfterProxy => {
                        if (ErrorAfterProxy == "Error: Request failed with status code 500") { // Domain not pointing and/or other error
                            //Delete since it creates it without the SSL cert. Damn you nginx proxy manager
                            //Ping and find the ID since it doesnt log when it fails
                            axios({
                                url: config.FRProxy.url + "/api/nginx/proxy-hosts",
                                method: 'GET',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': config.FRProxy.authKey,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {
                                //Now delete it
                                axios({
                                    url: config.FRProxy.url + "/api/nginx/proxy-hosts/" + ResponseAfterProxy.data.find(element => element.domain_names[0] == args[1].toLowerCase()).id,
                                    method: 'DELETE',
                                    followRedirect: true,
                                    maxRedirects: 5,
                                    headers: {
                                        'Authorization': config.FRProxy.authKey,
                                        'Content-Type': 'application/json',
                                    }
                                })
                            })

                        } else if (ErrorAfterProxy == "Error: Request failed with status code 400") { // Domain Already linked and/or other error
                            message.reply('This domain has already been linked. If this is an error, please contact a staff member to fix this!')
                        }
                    })
                } else if (dnsCheck.address == "192.95.42.75") { //Canada
                    message.channel.send("Domain found on Canada...");
                    axios({
                        url: config.CAProxy.url + "/api/nginx/proxy-hosts",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': config.CAProxy.authKey,
                            'Content-Type': 'application/json',
                        },
                        data: {
                            "domain_names": [
                                args[1].toLowerCase()
                            ],
                            "forward_scheme": "http",
                            "forward_host": response.data.attributes.sftp_details.ip,
                            "forward_port": response.data.attributes.relationships.allocations.data[0].attributes.port,
                            "access_list_id": "0",
                            "certificate_id": "new",
                            "meta": {
                                "letsencrypt_email": "proxy-renew@danbot.host",
                                "letsencrypt_agree": true,
                                "dns_challenge": false
                            },
                            "advanced_config": "",
                            "locations": [],
                            "block_exploits": false,
                            "caching_enabled": false,
                            "allow_websocket_upgrade": true,
                            "http2_support": false,
                            "hsts_enabled": false,
                            "hsts_subdomains": false,
                            "ssl_forced": true
                        }
                    }).then(ResponseAfterProxy => {
                        message.reply("Domain has been proxied, Its ID is: " + ResponseAfterProxy.data.id)
                        let datalmao = userData.get(message.author.id).domains || []
                        userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                            domain: args[1].toLowerCase(),
                            serverID: args[2],
                            location: "CA"
                        }]);

                    }).catch(ErrorAfterProxy => {
                        if (ErrorAfterProxy == "Error: Request failed with status code 500") { // Domain not pointing and/or other error
                            //Delete since it creates it without the SSL cert. Damn you nginx proxy manager
                            //Ping and find the ID since it doesnt log when it fails
                            axios({
                                url: config.CAProxy.url + "/api/nginx/proxy-hosts",
                                method: 'GET',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': config.CAProxy.authKey,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {
                                //Now delete it
                                axios({
                                    url: config.CAProxy.url + "/api/nginx/proxy-hosts/" + ResponseAfterProxy.data.find(element => element.domain_names[0] == args[1].toLowerCase()).id,
                                    method: 'DELETE',
                                    followRedirect: true,
                                    maxRedirects: 5,
                                    headers: {
                                        'Authorization': config.CAProxy.authKey,
                                        'Content-Type': 'application/json',
                                    }
                                })
                            })

                        } else if (ErrorAfterProxy == "Error: Request failed with status code 400") { // Domain Already linked and/or other error
                            message.reply('This domain has already been linked. If this is an error, please contact a staff member to fix this!');
                        }
                    })
                } else if (dnsCheck.address == "5.196.239.158") { //Donator
                    message.channel.send("Domain found on Donator...");
                    axios({
                        url: config.DonatorProxy.url + "/api/nginx/proxy-hosts",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': config.DonatorProxy.authKey,
                            'Content-Type': 'application/json',
                        },
                        data: {
                            "domain_names": [
                                args[1].toLowerCase()
                            ],
                            "forward_scheme": "http",
                            "forward_host": response.data.attributes.sftp_details.ip,
                            "forward_port": response.data.attributes.relationships.allocations.data[0].attributes.port,
                            "access_list_id": "0",
                            "certificate_id": "new",
                            "meta": {
                                "letsencrypt_email": "proxy-renew@danbot.host",
                                "letsencrypt_agree": true,
                                "dns_challenge": false
                            },
                            "advanced_config": "",
                            "locations": [],
                            "block_exploits": false,
                            "caching_enabled": false,
                            "allow_websocket_upgrade": true,
                            "http2_support": false,
                            "hsts_enabled": false,
                            "hsts_subdomains": false,
                            "ssl_forced": true
                        }
                    }).then(ResponseAfterProxy => {
                        //console.log(chalk.blue('DEBUG: ' + chalk.white(ResponseAfterProxy))
                        message.reply("Domain has been proxied, Its ID is: " + ResponseAfterProxy.data.id)
                        let datalmao = userData.get(message.author.id).domains || []
                        userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                            domain: args[1].toLowerCase(),
                            serverID: args[2],
                            location: "Donator"
                        }]);

                    }).catch(ErrorAfterProxy => {
                        if (ErrorAfterProxy == "Error: Request failed with status code 500") { // Domain not pointing and/or other error
                            //Delete since it creates it without the SSL cert. Damn you nginx proxy manager
                            //Ping and find the ID since it doesnt log when it fails
                            axios({
                                url: config.DonatorProxy.url + "/api/nginx/proxy-hosts",
                                method: 'GET',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': config.DonatorProxy.authKey,
                                    'Content-Type': 'application/json',
                                }
                            }).then(response => {
                                //Now delete it
                                axios({
                                    url: config.DonatorProxy.url + "/api/nginx/proxy-hosts/" + ResponseAfterProxy.data.find(element => element.domain_names[0] == args[1].toLowerCase()).id,
                                    method: 'DELETE',
                                    followRedirect: true,
                                    maxRedirects: 5,
                                    headers: {
                                        'Authorization': config.DonatorProxy.authKey,
                                        'Content-Type': 'application/json',
                                    }
                                })
                            })

                        } else if (ErrorAfterProxy == "Error: Request failed with status code 400") { // Domain Already linked and/or other error
                            message.reply('This domain has already been linked. If this is an error, please contact a staff member to fix this!');
                        }
                    })
                }
            })
        })
    }
}
