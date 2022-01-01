const sshClient = require('ssh2').Client;
const axios = require('axios');
const exec = require('child_process').exec;

async function getNewKey() {
    const serverRes = await axios({
        url: config.proxy.url + "/api/tokens",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "identity": config.proxy.email,
            "secret": config.proxy.pass
        }
    });
    return "Bearer " + serverRes.data.token;
};

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('__**How to link a domain to a website/server**__ \nCommand format: ' + config.DiscordBot.Prefix + 'server proxy domain serverid')
    if (!args[1] || !args[2]) {
        await message.channel.send(embed)
    } else {

        if (args[1].toLowerCase().includes('only-fans.club')) {
            if (!message.member.roles.cache.some(r => ['898041754564046869', '710208090741539006'].includes(r.id))) return message.channel.send('Sorry, only-fans.club subdomains are only available for boosters and donators. ')
        };

        const linkalready = userData.fetchAll().filter(users => users.data.domains && users.data.domains.filter(x => x.domain === args[1]).length != 0);
        if (linkalready[0]) {
            return message.channel.send('Domain is already linked')
        };

        if (!/[A-Za-z0-9-.]{1, 63}/.test(args[1])) { //Check the provided domain is a valid domain
            return message.channel.send('That is not a valid domain! \nExample of domains:\nValid: danbot.host\nInvalid: https://danbot.host/')
        };

        const pingCheck = await new Promise((res) => {
            exec(`ping "${args[1]}"`, (error, stdout) => {
                let response = (error || stdout);
                res(response);
            });
        });

        console.log(pingCheck)

        config.proxy.authKey = await getNewKey();

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
                message.reply('Waiting...')

                axios({
                    url: config.proxy.url + "/api/nginx/proxy-hosts",
                    method: 'POST',
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': config.proxy.authKey,
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
                        "allow_websocket_upgrade": false,
                        "http2_support": false,
                        "hsts_enabled": false,
                        "hsts_subdomains": false,
                        "ssl_forced": true
                    }
                }).then(ResponseAfterProxy => {
                    //console.log(chalk.blue('DEBUG: ' + chalk.white(ResponseAfterProxy))
                    message.reply("Domain has been proxied, It's ID is: " + ResponseAfterProxy.data.id)
                    let datalmao = userData.get(message.author.id).domains || []
                    userData.set(message.author.id + '.domains', [...new Set(datalmao), {
                        domain: args[1].toLowerCase(),
                        serverID: args[2],
                    }]);

                }).catch(ErrorAfterProxy => {
                    if (ErrorAfterProxy == "Error: Request failed with status code 500") { // Domain not pointing and/or other error
                        //Delete since it creates it without the SSL cert. Damn you nginx proxy manager
                        //Ping and find the ID since it doesnt log when it fails
                        axios({
                            url: config.proxy.url + "/api/nginx/proxy-hosts",
                            method: 'GET',
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                'Authorization': config.proxy.authKey,
                                'Content-Type': 'application/json',
                            }
                        }).then(response => {
                            //Now delete it
                            axios({
                                url: config.proxy.url + "/api/nginx/proxy-hosts/" + ResponseAfterProxy.data.find(element => element.domain_names[0] == args[1].toLowerCase()).id,
                                method: 'DELETE',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': config.proxy.authKey,
                                    'Content-Type': 'application/json',
                                }
                            })
                        })

                    } else if (ErrorAfterProxy == "Error: Request failed with status code 400") { // Domain Already linked and/or other error
                        message.reply('This domain has already been linked, If this is a error please contact Dan')
                    }
                })

            })
        })
    }
}
