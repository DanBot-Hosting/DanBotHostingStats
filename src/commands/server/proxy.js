const Discord = require('discord.js');
const Axios = require("axios");
const dns = require("dns");

const Config = require('../../../config.json');
const MiscConfigs = require('../../../config/misc-configs.js');
const Proxies = require('../../../config/proxy-configs.js').Proxies;
const PremiumDomains = require('../../../config/proxy-configs.js').PremiumDomains;
const getUserServers = require('../../util/getUserServers.js');

async function getToken(Url, Email, Password) {
    const serverRes = await Axios({
        url: Url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        timeout: 15 * 1000,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: Email,
            secret: Password,
        },
    });
    return "Bearer " + serverRes.data.token;
}

async function getAllProxies(Url, Token) {
    return await Axios({
        url: Url + "/api/nginx/proxy-hosts",
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: Token,
            "Content-Type": "application/json",
        }        
    });
}

exports.description = "Proxy a domain to a server. View this command for usage.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    return message.reply("This command has been permanently disabled. you can now proxy via domains tab");

    const ProxyLocations = Proxies.map((Proxy) => `> \`${Proxy.ip}\` - [${Proxy.name}] 🟢 Enabled`).join('\n');
    const PremiumDomainsList = PremiumDomains.map((domain) => `\`${domain}\``).join(', ');

    const embed = new Discord.EmbedBuilder()
        .setTitle("**DanBot Hosting Proxy System**")
        .setDescription(
            `The DanBot Hosting proxy systems allows users to proxy their domains to their servers with simple commands.

            The command format: \`${Config.DiscordBot.Prefix}server proxy <domain> <serverId>\`

            You can find your server ID by running the following command: \`${Config.DiscordBot.Prefix}server list\`

            You can link a domain by first creating a DNS A record, pointed towards one of the following proxies:\n\n` +

            ProxyLocations

            + `\n\nIf you are using Cloudflare, make sure you are using **DNS only mode**, and disabling **always use HTTPS**.

            Donators can use the ` + PremiumDomainsList + ` subdomains! Replace \`<domain>\` with the \`your-subdomain.domainhere\` to use it!`,
        )
        .setColor("Blue");

    // The user didn't provide enough arguments.
    if (!args[1] || !args[2]) {
        await message.channel.send({embeds: [embed]}).catch((Error) => {});
        return;
    }

    //The user is attempting to use a premium domain but doesn't have the correct roles.
    if (PremiumDomains.some(domain => args[1].toLowerCase().includes(domain)) && !message.member.roles.cache.some(r => [Config.DiscordBot.Roles.Donator, Config.DiscordBot.Roles.Booster].includes(r.id))) {
        return message.channel.send("Sorry, this domain is only available to donators and boosters.").catch((Error) => {});
        
    };

    const user = await userData.get(message.author.id);

    if (!user) {
        return message.channel.send("User not found.").catch((Error) => {});
    }
    
    const linkAlready = user.domains.some((x) => x.domain === args[1]);

    if (linkAlready) return message.channel.send("You have already linked this domain.").catch((Error) => {});

    //Domain is not in the correct format.
    if (!/^[a-zA-Z0-9.-]+$/.test(args[1])) {
        return message.channel.send("Invalid domain format.").catch((Error) => {});
    }

    // Domain will not be DNS lookup to verify it's being pointed to a correct IP.
    const dnsCheck = await new Promise((resolve) => {
        dns.lookup(args[1], { family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED }, (err, address) =>
            resolve({ err, address }),
        );
    });

    const validAddresses = Proxies.map((Proxy) => Proxy.ip);

    if (!validAddresses.includes(dnsCheck.address)) {
        return message.channel.send(
            "ERROR: You must have a DNS A Record pointing to one of the following addresses: " +
                validAddresses.join(", "),
        ).catch((Error) => {});
    }

    const PremiumProxiesIPs = Proxies.filter((Proxy) => Proxy.premiumOnly).map((Proxy) => Proxy.ip);

    if (
        !message.member.roles.cache.some((r) =>
            [Config.DiscordBot.Roles.Donator, Config.DiscordBot.Roles.Booster].includes(r.id),
        ) && PremiumProxiesIPs.includes(dnsCheck.address)
    ) {
        return message.reply(
            "Sorry, this proxy location is only available for boosters and donators.",
        ).catch((Error) => {});
    }

    await getUserServers(await user.consoleID).then(async (PterodactylResponse) => {
        PterodactylResponse = PterodactylResponse.attributes;

        if (PterodactylResponse.relationships) {
            PterodactylResponse.extras = {};
            for (let key in PterodactylResponse.relationships) {
                PterodactylResponse.extras[key] = PterodactylResponse.relationships[key].data
                    ? PterodactylResponse.relationships[key].data.map((a) => a.attributes)
                    : PterodactylResponse.relationships[key];
            }
            delete PterodactylResponse.relationships;
        }

        if (!PterodactylResponse.extras.servers || !PterodactylResponse.extras.servers.find((x) => x.identifier === args[2])) {
            return message.channel.send(
                "Couldn't find that server in your server list.\nDo you own that server?",
            ).catch((Error) => {});
        }

        const axiosConfig = {
            url: `${Config.Pterodactyl.hosturl}/api/client/servers/${args[2]}`,
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${Config.Pterodactyl.apikeyclient}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        };

        Axios(axiosConfig).then(async (PterodactylServerResponse) => {
            const replyMsg = await message.reply(
                "Proxying your domain... this can take up to 30 seconds.",
            ).catch((Error) => {});

            const ProxyLocation = Proxies.find((Location) => Location.ip == dnsCheck.address);

            //This in theory should never happen.
            if(ProxyLocation == undefined) return message.channel.send("Woah, you discovered an error that shouldn't be possible. - DIBSTER.").catch((Error) => {});

            const Token = await getToken(ProxyLocation.url, ProxyLocation.email, ProxyLocation.pass).catch(async (Error) => {

                // If the command fails, that means the proxy server is likely down.
                if(Error.code === "ECONNABORTED" ||  Error.code === "ETIMEDOUT") {
                    await message.reply("[PROXY SYSTEM] The proxy server is currently down. Please try again later. Watch <#" + MiscConfigs.serverStatus + "> for more information.");
                    return;
                } else {
                    await message.reply("[PROXY SYSTEM] An error occurred while trying to unproxy the domain. Please try again later.");
                    return;
                };
            });

            if(!Token) return;

            const AllProxies = await getAllProxies(ProxyLocation.url, Token);

            //It was found in the proxy already.
            if (AllProxies.data.find(x => x.domain_names[0] == args[1].toLowerCase()) != undefined) {
                return message.channel.send("This domain has already been proxied on this location. If you believe this to be an error, please contact a staff member.").catch((Error) => {});
            }

            replyMsg.edit(`Domain found pointing towards ${ProxyLocation.name}...`).catch((Error) => {});

            proxyDomain(ProxyLocation, PterodactylServerResponse, replyMsg, args, Token);
        }).catch(async (Error) => {
            console.error("[SERVER PROXY - GETTING SERVER]: " + Error);
            return message.channel.send("An error occurred while fetching your server. Please try again later.").catch((Error) => {});
        });

        function proxyDomain(ProxyLocation, response, replyMsg, args, token) {

            const axiosProxyConfig = {
                url: `${ProxyLocation.url}/api/nginx/proxy-hosts`,
                method: "POST",
                followRedirect: true,
                timeout: 30 * 1000,
                maxRedirects: 5,
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                data: {
                    domain_names: [args[1].toLowerCase()],
                    forward_scheme: "http",
                    forward_host: response.data.attributes.sftp_details.ip,
                    forward_port:
                        response.data.attributes.relationships.allocations.data.find(m => m.attributes.is_default).attributes.port,
                    access_list_id: "0",
                    certificate_id: "new",
                    meta: {
                        letsencrypt_email: "proxy-renew@danbot.host",
                        letsencrypt_agree: true,
                        dns_challenge: false,
                    },
                    advanced_config: "",
                    locations: [],
                    block_exploits: false,
                    caching_enabled: false,
                    allow_websocket_upgrade: true,
                    http2_support: false,
                    hsts_enabled: false,
                    hsts_subdomains: false,
                    ssl_forced: true,
                },
            };

            let ResponseAfterProxy1 = null;
            
            Axios(axiosProxyConfig).then(async (ResponseAfterProxy) => {
                ResponseAfterProxy1 = ResponseAfterProxy;

                replyMsg.edit(
                    `Domain has been proxied:\n\n` +
                    `ID: ${ResponseAfterProxy.data.id}\n` +
                    `Location: ${ProxyLocation.name}`
                ).catch((Error) => {});

                let userAccount = await userData.get(message.author.id);

                if(userAccount.domains == undefined) userAccount.domains = [];

                await userData.set(`${message.author.id}.domains`, [
                    ...new Set(userAccount.domains),
                    {
                        domain: args[1].toLowerCase(),
                        serverID: args[2],
                        location: ProxyLocation.dbLocation,
                    },
                ]);
            })
                .catch(async (ErrorAfterProxy) => {

                    if (ErrorAfterProxy.response) {
                        console.log("[SERVER PROXY - PROXYING & CERTIFICATE]: " + ErrorAfterProxy.response.data.error.message + " - " + ErrorAfterProxy.response.status);
                    }

                    await handleProxyError(
                        ErrorAfterProxy,
                        replyMsg,
                        args,
                        ProxyLocation,
                        ResponseAfterProxy1,
                        token
                    );
                });
        }

        async function handleProxyError(
            ErrorAfterProxy,
            replyMsg,
            args,
            ProxyLocation,
            ResponseAfterProxy,
            token
        ) {
            // If no response was acknowledged from the request.
            if(!ErrorAfterProxy.response){

                await replyMsg.edit(
                    replyMsg.content + "\nAn internal server error has occurred. Attempting to delete failed proxy."
                ).catch((Error) => {});

                await deleteFailedProxy(replyMsg, args, ProxyLocation, ResponseAfterProxy, token);
            } else if (ErrorAfterProxy.response.status == 500) {
                await replyMsg.edit(
                    replyMsg.content + "\nAn internal server error has occurred. Attempting to delete failed proxy."
                ).catch((Error) => {});

                await deleteFailedProxy(replyMsg, args, ProxyLocation, ResponseAfterProxy, token);
            } else if (ErrorAfterProxy.response.status == 400) {
                await replyMsg.edit(
                    replyMsg.content + "\nThis domain has already been linked. If this is an error, please contact a staff member to fix this."
                ).catch((Error) => {});
            } else {
                await replyMsg.edit(
                    replyMsg.content + "\nAn unknown issue has occurred. Please contact a staff member."
                ).catch((Error) => {});
            }
        }

        async function deleteFailedProxy(replyMsg, args, ProxyLocation, ResponseAfterProxy, token) {

            //Requesting all proxies from the failed location.
            await getAllProxies(ProxyLocation.url, token).then(async (response) => {

                //Finding the domain ID of the failed proxy.
                const Domain = response.data.find(m => m.domain_names[0] == args[1].toLowerCase());

                //If the bot was not able to find the fail proxy by it's ID.
                if (Domain == undefined) return await replyMsg.edit(replyMsg.content + "\n\nUnable to delete proxy automatically. You must have a staff member to manually fix this.");

                const axiosGetProxyConfig = {
                    url: `${ProxyLocation.url}/api/nginx/proxy-hosts`,
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                };
    
                await Axios(axiosGetProxyConfig).then(async (response) => {
                    const axiosDeleteProxyConfig = {
                        url: `${ProxyLocation.url}/api/nginx/proxy-hosts/${Domain.id}`,
                        method: "DELETE",
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json",
                        },
                    };
    
                    await Axios(axiosDeleteProxyConfig);
                }).then(async (Response) => {
                    await replyMsg.edit(replyMsg.content + "\n\nAutomatically deleted failed proxy.").catch((Error) => {});
                }).catch(async (Error) => {
                    console.error("[SERVER PROXY - DELETION OF FAILED PROXY]: " + Error);

                    await replyMsg.edit(replyMsg.content + "\n\nUnable to delete proxy automatically. You must have a staff member to manually fix this.").catch((Error) => {});
                });
            }).catch(async (Error) => {
                await replyMsg.edit(replyMsg.content + "\n\nUnable to delete proxy automatically. You must have a staff member to manually fix this.").catch((Error) => {});
            });
        }
    }).catch(async (Error) => {
        console.error("[SERVER PROXY - GETTING USER SERVERS]: " + Error);
        return message.channel.send("An error occurred while fetching your servers. Please try again later.");
    });
};
