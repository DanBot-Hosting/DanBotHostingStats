const sshClient = require('ssh2').Client;
const axios = require('axios');
const dns = require('dns');

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
        .setTitle('__**How to link a domain to your website/server**__')
        .setDescription('`' + config.DiscordBot.Prefix + 'server proxy <domain> <serverid>`\nMake sure to replace <domain> with your domain and <serverid> with the ID of your server. You can find your server id by running `' + config.DiscordBot.Prefix + 'server list`\nYou can link your own domain by creating a DNS A Record pointing to \`164.132.74.251\`! If you are using Cloudflare make sure the you are using DNS Only mode!\nOr you can use the free Danbot Host domains:\n `*.never-gonna-give-you-up.xyz\n*.never-gonna-let-you-down.xyz\n*.never-gonna-make-you-cry.xyz\n*.never-gonna-run-around-and-desert-you.xyz\n*.never-gonna-say-goodbye.xyz\n*.never-gonna-tell-a-lie-and-hurt-you.xyz\n*.rick-roll.xyz`\nFor donators there is also the domain `*.only-fans.club`.')
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

        if (!/^[a-zA-Z0-9.-]+$/.test(args[1]) || args[1].length > 253) { //Check the provided domain is a valid domain
            return message.channel.send('That is not a valid domain! \nExample of domains:\nValid: danbot.host\nInvalid: <https://danbot.host/>')
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

        if(dnsCheck.address != "164.132.74.251"){
            return message.channel.send('ERROR: You must have a DNS A Record pointing to \`164.132.74.251\`! Also if you are using Cloudflare make sure the you are using DNS Only mode!\nIf you have done all of that and it\'s still not working: Try again later, because sometimes DNS changes can take a while to update. (Can take up to 24 hours to update!)')
        };
        
        if (Date.now() < 1648653576000)
            return message.channel.send('New proxy crearion has been disabled untill 30/03/21 05:21 GMT!'):
                
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
                message.reply('Proxying your domain... This can take up to 30 seconds.')

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
                        "allow_websocket_upgrade": true,
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
                        message.reply('This domain has already been linked. If this is an error, please contact a staff member to fix this!')
                    }
                })

            })
        })
    }
}
