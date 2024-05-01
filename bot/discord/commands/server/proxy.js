const axios = require("axios");
const dns = require("dns");

async function getNewKey(proxyConfig) {
    const serverRes = await axios({
        url: proxyConfig.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: proxyConfig.email,
            secret: proxyConfig.pass,
        },
    });
    return "Bearer " + serverRes.data.token;
}

exports.getNewKeyUS1 = () => getNewKey(config.USProxy1);
exports.getNewKeyUS2 = () => getNewKey(config.USProxy2);
exports.getNewKeyUS3 = () => getNewKey(config.USProxy3);
exports.getNewKeyUS4 = () => getNewKey(config.USProxy4);

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("**DanBot Hosting Proxy System**")
        .setDescription(
            `The DanBot Hosting proxy systems allows users to proxy their domains to their servers with simple commands.

            The command format: \`${config.DiscordBot.Prefix}server proxy <domain> <serverId>\`

            You can find your server ID by running the following command: \`${config.DiscordBot.Prefix}server list\`

            You can link a domain by first creating a DNS A record, pointed towards one of the following proxies:

            > \`69.197.135.202\` - [US 1] 🟢 Enabled
            > \`69.197.135.203\` - [US 2] 🟢 Enabled
            > \`69.197.135.204\` - [US 3] 🟢 Enabled
            > \`69.197.135.205\` - [US 4] 🟢 Enabled

            If you are using Cloudflare, make sure you are using **DNS only mode**, and disabling **always use HTTPS**.

            Donators can use the \`*.only-fans.club\` subdomains! Replace \`<domain>\` with the \`your-subdomain.only-fans.club\` to use it! Please note these domains are proxied through France, and will not work if France is disabled.`
        )
        .setColor("BLUE");

    if (!args[1] || !args[2]) {
        await message.reply(embed);
        return;
    }

    if (args[1].toLowerCase().includes("only-fans.club")) {
        if (!message.member.roles.cache.some((r) => ["898041754564046869", "710208090741539006"].includes(r.id))) {
            return message.reply("Sorry, only-fans.club subdomains are only available for boosters and donators.");
        }
    }

    const linkalready = userData
        .fetchAll()
        .filter(
            (users) => users.data.domains && users.data.domains.filter((x) => x.domain === args[1]).length != 0
        );
    if (linkalready[0]) {
        return message.reply("Domain is already linked.");
    }

    if (!/^[a-zA-Z0-9.-]+$/.test(args[1])) {
        return message.reply("Invalid domain format.");
    }
    const dnsCheck = await new Promise((resolve) => {
        dns.lookup(args[1], { family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED }, (err, address) => resolve({ err, address }));
    });

    const validAddresses = ["69.197.135.202", "69.197.135.203", "69.197.135.204", "69.197.135.205"];
    if (!validAddresses.includes(dnsCheck.address)) {
        return message.reply("ERROR: You must have a DNS A Record pointing to one of the following addresses: " + validAddresses.join(", "));
    }

    if (!message.member.roles.cache.some((r) => ["898041754564046869", "710208090741539006"].includes(r.id)) && "69.30.249.53" == dnsCheck.address) {
        return message.reply("Sorry, this proxy location is only available for boosters and donators.");
    }

    const proxies = [config.USProxy1, config.USProxy2, config.USProxy3, config.USProxy4];
    for (let proxy of proxies) {
        proxy.authKey = await getNewKey(proxy);
    }

    const url = `${config.Pterodactyl.hosturl}/api/application/users/${userData.get(message.author.id).consoleID}?include=servers`;
    axios.get(url, {
        headers: {
            Authorization: "Bearer " + config.Pterodactyl.apikey,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
        },
    }).then((use) => {
        use = use.data.attributes;
        if (use.relationships) {
            use.extras = {};
            for (let key in use.relationships) {
                use.extras[key] = use.relationships[key].data ? use.relationships[key].data.map((a) => a.attributes) : use.relationships[key];
            }
            delete use.relationships;
        }

        if (!use.extras.servers || !use.extras.servers.find((x) => x.identifier === args[2])) {
            return message.reply("Couldn't find that server in your server list.\nDo you own that server?");
        }

        const axiosConfig = {
            url: `${config.Pterodactyl.hosturl}/api/client/servers/${args[2]}`,
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${config.Pterodactyl.apikeyclient}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        };

        axios(axiosConfig).then(async (response) => {
            const replyMsg = await message.reply("Proxying your domain... this can take up to 30 seconds.");

            if (dnsCheck.address == "69.197.135.202") {
                replyMsg.edit("Domain found pointing towards US Proxy 1...");
                proxyDomain(config.USProxy1, response, replyMsg, args, "US1");
            } else if (dnsCheck.address == "69.197.135.203") {
                replyMsg.edit("Domain found pointing towards US Proxy 2...");
                proxyDomain(config.USProxy2, response, replyMsg, args, "US2");
            }  else if (dnsCheck.address == "69.197.135.204") {
                replyMsg.edit("Domain found pointing towards US Proxy 3...");
                proxyDomain(config.USProxy3, response, replyMsg, args, "US3");
            } else if (dnsCheck.address == "69.197.135.205") {
                replyMsg.edit("Domain found pointing towards US Proxy 4...");
                proxyDomain(config.USProxy4, response, replyMsg, args, "US4");
            }
        });

        function proxyDomain(proxyConfig, response, replyMsg, args, location) {
            const axiosProxyConfig = {
                url: `${proxyConfig.url}/api/nginx/proxy-hosts`,
                method: "POST",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: proxyConfig.authKey,
                    "Content-Type": "application/json",
                },
                data: {
                    domain_names: [args[1].toLowerCase()],
                    forward_scheme: "http",
                    forward_host: response.data.attributes.sftp_details.ip,
                    forward_port: response.data.attributes.relationships.allocations.data[0].attributes.port,
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

            axios(axiosProxyConfig)
                .then((ResponseAfterProxy) => {
                    replyMsg.edit(`Domain has been proxied, its ID is: ${ResponseAfterProxy.data.id}`);
                    let datalmao = userData.get(message.author.id).domains || [];
                    userData.set(`${message.author.id}.domains`, [
                        ...new Set(datalmao),
                        {
                            domain: args[1].toLowerCase(),
                            serverID: args[2],
                            location: location,
                        },
                    ]);
                })
                .catch((ErrorAfterProxy) => {
                    handleProxyError(ErrorAfterProxy, replyMsg, args, proxyConfig, ResponseAfterProxy);
                });
        }

        function handleProxyError(ErrorAfterProxy, replyMsg, args, proxyConfig, ResponseAfterProxy) {
            if (ErrorAfterProxy == "Error: Request failed with status code 500") {
                deleteFailedProxy(replyMsg, args, proxyConfig, ResponseAfterProxy);
            } else if (ErrorAfterProxy == "Error: Request failed with status code 400") {
                replyMsg.edit("This domain has already been linked. If this is an error, please contact a staff member to fix this!");
            }
        }

        function deleteFailedProxy(replyMsg, args, proxyConfig, ResponseAfterProxy) {
            const axiosGetProxyConfig = {
                url: `${proxyConfig.url}/api/nginx/proxy-hosts`,
                method: "GET",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: proxyConfig.authKey,
                    "Content-Type": "application/json",
                },
            };

            axios(axiosGetProxyConfig).then((response) => {
                const axiosDeleteProxyConfig = {
                    url: `${proxyConfig.url}/api/nginx/proxy-hosts/${ResponseAfterProxy.data.find(
                        (element) => element.domain_names[0] == args[1].toLowerCase()
                    ).id}`,
                    method: "DELETE",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: proxyConfig.authKey,
                        "Content-Type": "application/json",
                    },
                };

                axios(axiosDeleteProxyConfig);
            });
        }
    });
};
