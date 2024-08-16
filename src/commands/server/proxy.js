const Discord = require('discord.js');
const Axios = require("axios");
const dns = require("dns");

const Config = require('../../../config.json');
const Proxies = require('../../../config/proxy-configs.js').Proxies;
const PremiumDomains = require('../../../config/proxy-configs.js').PremiumDomains;
const getUserServers = require('../../util/getUserServers.js');

async function getToken(Url, Email, Password) {
    const serverRes = await Axios({
        url: Url + "/api/tokens",
        method: "POST",
        followRedirect: true,
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

exports.description = "Proxy'uj domenę do serwera. Sprawdź tę komendę, aby uzyskać więcej informacji.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const ProxyLocations = Proxies.map((Proxy) => `> \`${Proxy.ip}\` - [${Proxy.name}] 🟢 Włączony`).join('\n');
    const PremiumDomainsList = PremiumDomains.map((domain) => `\`${domain}\``).join(', ');

    const embed = new Discord.MessageEmbed()
        .setTitle("**System Proxy DanBot Hosting**")
        .setDescription(
            `System proxy DanBot Hosting pozwala użytkownikom na proxy'owanie ich domen do ich serwerów za pomocą prostych komend.

            Format komendy: \`${Config.DiscordBot.Prefix}server proxy <domena> <serverId>\`

            Możesz znaleźć ID swojego serwera, uruchamiając następującą komendę: \`${Config.DiscordBot.Prefix}server list\`

            Możesz powiązać domenę, najpierw tworząc rekord DNS A, wskazujący na jeden z poniższych proxy:\n\n` +

            ProxyLocations

            + `\n\nJeśli używasz Cloudflare, upewnij się, że używasz **tylko trybu DNS** oraz wyłącz **zawsze używaj HTTPS**.

            Donatorzy mogą korzystać z subdomen ` + PremiumDomainsList + `! Zamień \`<domena>\` na \`your-subdomain.domainhere\`, aby z niej skorzystać!`,
        )
        .setColor("BLUE");

    // Użytkownik nie podał wystarczającej liczby argumentów.
    if (!args[1] || !args[2]) {
        await message.channel.send(embed);
        return;
    }

    // Użytkownik próbuje użyć domeny premium, ale nie ma odpowiednich ról.
    if (PremiumDomains.some(domain => args[1].toLowerCase().includes(domain)) && !message.member.roles.cache.some(r => [Config.DiscordBot.Roles.Donator, Config.DiscordBot.Roles.Booster].includes(r.id))) {
        return message.channel.send("Przepraszam, ta domena jest dostępna tylko dla donatorów i boosterów.");

    };

    const user = userData.get(message.author.id);

    if (!user) {
        return message.channel.send("Użytkownik nie znaleziony.");
    }

    const linkAlready = user.domains.some((x) => x.domain === args[1]);

    if (linkAlready) return message.channel.send("Ta domena jest już powiązana.");

    // Domena nie jest w poprawnym formacie.
    if (!/^[a-zA-Z0-9.-]+$/.test(args[1])) {
        return message.channel.send("Niepoprawny format domeny.");
    }

    // Domena nie jest sprawdzana przez DNS, aby zweryfikować, czy wskazuje na poprawny adres IP.
    const dnsCheck = await new Promise((resolve) => {
        dns.lookup(args[1], { family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED }, (err, address) =>
            resolve({ err, address }),
        );
    });

    const validAddresses = Proxies.map((Proxy) => Proxy.ip);

    if (!validAddresses.includes(dnsCheck.address)) {
        return message.channel.send(
            "BŁĄD: Musisz mieć rekord DNS A wskazujący na jeden z poniższych adresów: " +
            validAddresses.join(", "),
        );
    }

    const PremiumProxiesIPs = Proxies.filter((Proxy) => Proxy.premiumOnly).map((Proxy) => Proxy.ip);

    if (
        !message.member.roles.cache.some((r) =>
            [Config.DiscordBot.Roles.Donator, Config.DiscordBot.Roles.Booster].includes(r.id),
        ) && PremiumProxiesIPs.includes(dnsCheck.address)
    ) {
        return message.reply(
            "Przepraszam, ta lokalizacja proxy jest dostępna tylko dla boosterów i donatorów.",
        );
    }

    const UserServers = await getUserServers(userData.get(message.author.id).consoleID).then(async (PterodactylResponse) => {
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
                "Nie znaleziono tego serwera na liście serwerów.\nCzy posiadasz ten serwer?",
            );
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
                "Proxoowanie Twojej domeny... Może to potrwać do 30 sekund.",
            );

            const ProxyLocation = Proxies.find((Location) => Location.ip == dnsCheck.address);

            //To teoretycznie nigdy nie powinno się zdarzyć.
            if (ProxyLocation == undefined) return message.channel.send("Ojej, odkryłeś błąd, który nie powinien występować. ~ Smutex.");

            const Token = await getToken(ProxyLocation.url, ProxyLocation.email, ProxyLocation.pass);

            const AllProxies = await getAllProxies(ProxyLocation.url, Token);

            //Zostało znalezione w proxy już.
            if (AllProxies.data.find(x => x.domain_names[0] == args[1].toLowerCase()) != undefined) {
                return message.channel.send("Ta domena została już proxied w tej lokalizacji. Jeśli uważasz, że to błąd, skontaktuj się z członkiem personelu.");
            }

            replyMsg.edit(`Domena znaleziona wskazująca na ${ProxyLocation.name}...`);

            proxyDomain(ProxyLocation, PterodactylServerResponse, replyMsg, args, Token);
        });

        function proxyDomain(ProxyLocation, response, replyMsg, args, token) {

            const axiosProxyConfig = {
                url: `${ProxyLocation.url}/api/nginx/proxy-hosts`,
                method: "POST",
                followRedirect: true,
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
                        response.data.attributes.relationships.allocations.data[0].attributes
                            .port,
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

            Axios(axiosProxyConfig).then((ResponseAfterProxy) => {
                replyMsg.edit(
                    `Domena została proxied:\n\n` +
                    `ID: ${ResponseAfterProxy.data.id}\n` +
                    `Lokalizacja: ${ProxyLocation.name}`
                );

                const NewUserData = userData.get(message.author.id).domains || [];

                userData.set(`${message.author.id}.domains`, [
                    ...new Set(NewUserData),
                    {
                        domain: args[1].toLowerCase(),
                        serverID: args[2],
                        location: ProxyLocation.dbLocation,
                    },
                ]);
            })
                .catch((ErrorAfterProxy) => {
                    handleProxyError(
                        ErrorAfterProxy,
                        replyMsg,
                        args,
                        ProxyLocation,
                        ResponseAfterProxy,
                        token
                    );
                });
        }

        function handleProxyError(
            ErrorAfterProxy,
            replyMsg,
            args,
            ProxyLocation,
            ResponseAfterProxy,
            token
        ) {
            if (ErrorAfterProxy == "Error: Request failed with status code 500") {
                deleteFailedProxy(replyMsg, args, ProxyLocation, ResponseAfterProxy, token);
            } else if (ErrorAfterProxy == "Error: Request failed with status code 400") {
                replyMsg.edit(
                    "Ta domena została już powiązana. Jeśli to błąd, skontaktuj się z Smutexem, aby to naprawić!",
                );
            }
        }

        function deleteFailedProxy(replyMsg, args, ProxyLocation, ResponseAfterProxy, token) {
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

            Axios(axiosGetProxyConfig).then((response) => {
                const axiosDeleteProxyConfig = {
                    url: `${ProxyLocation.url}/api/nginx/proxy-hosts/${ResponseAfterProxy.data.find(
                        (element) => element.domain_names[0] == args[1].toLowerCase(),
                    ).id
                        }`,
                    method: "DELETE",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                };

                Axios(axiosDeleteProxyConfig);
            });
        }
    });
};