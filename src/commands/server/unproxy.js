const Discord = require('discord.js');
const Axios = require('axios');

const Config = require('../../../config.json');
const Proxies = require('../../../config/proxy-configs.js').Proxies;

// Ta funkcja generuje nowy token dla określonej lokalizacji.
async function getToken(Url, Email, Password) {
    const serverRes = await axios({
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

// Ta funkcja usuwa certyfikat dla domeny.
async function deleteCertificate(Url, Token, Domain, ProxiesResponse) {
    return await axios({
        url:
            Url +
            "/api/nginx/certificates/" +
            ProxiesResponse.data.find(
                (element) => element.domain_names[0] == Domain,
            ).id,
        method: "DELETE",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: Token,
            "Content-Type": "application/json",
        },
    });
}

// Ta funkcja usuwa proxy dla domeny.
async function deleteProxy(Url, Token, Domain, ProxiesResponse) {
    return await axios({
        url:
            Url +
            "/api/nginx/proxy-hosts/" +
            ProxiesResponse.data.find(
                (element) =>
                    element.domain_names[0] == Domain,
            ).id,
        method: "DELETE",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: Token,
            "Content-Type": "application/json",
        },
    });
}

// Ta funkcja pobiera wszystkie certyfikaty dla domeny.
async function getAllCertificates(Url, Token) {
    return await axios({
        url: Url + "/api/nginx/certificates",
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            Authorization: Token,
            "Content-Type": "application/json",
        },
    });
}

// Usuwa domenę z bazy danych użytkownika.
async function deleteDomainDB(UserId, Domain) {
    userData.set(
        UserId + ".domains",
        userData
            .get(UserId)
            .domains.filter((x) => x.domain != Domain),
    );

    return true;
}

exports.description = "Usuwa proxy dla domeny z serwera.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const UnproxyEmbed = new Discord.MessageEmbed();
    UnproxyEmbed.setTitle("**Usuwanie proxy domeny z serwera DBH:**");
    UnproxyEmbed.setColor('BLUE');
    UnproxyEmbed.setDescription(
        "\n\nSkładnia komendy: ```" +
        Config.DiscordBot.Prefix +
        "server unproxy <DOMAIN>```\n" +
        "- Zamień `<DOMAIN>` na swoją domenę. Przykład: `example.danbot.host`\n" +
        "- Listę wszystkich swoich proxowanych domen znajdziesz za pomocą: `" +
        Config.DiscordBot.Prefix +
        "user domains`",
    );
    UnproxyEmbed.setTimestamp();
    UnproxyEmbed.setFooter("DanBot Hosting");

    // Jeśli nie podano argumentów.
    if (!args[1]) return await message.channel.send(UnproxyEmbed);

    // Dane domeny użytkownika.
    const userDomains = await userData.get(message.author.id + ".domains");

    // Nieprawidłowa domena.
    if (userDomains.find((x) => x.domain === args[1].toLowerCase()) == null) {
        message.reply(
            "Nie mogłem znaleźć tej domeny! Upewnij się, że wprowadziłeś prawidłową domenę. Prawidłowa domena to `danbot.host`, `https://danbot.host/` nie jest prawidłową domeną!",
        );
        return;
    }

    const domainData = userDomains.find((x) => x.domain === args[1].toLowerCase());

    if (Proxies.map(x => x.dbLocation).includes(domainData.location)) {

        // Informacje o proxy potrzebne do kontynuacji.
        const ProxyInformation = Proxies.find(x => x.dbLocation == domainData.location);

        // Generuje nowy token dla określonej lokalizacji.
        const ProxyToken = await getToken(ProxyInformation.url, ProxyInformation.email, ProxyInformation.pass);

        // Pobiera listę wszystkich proxy.
        await Axios({
            url: ProxyInformation.url + "/api/nginx/proxy-hosts",
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: ProxyToken,
                "Content-Type": "application/json",
            }
        }).then(async (ProxiesResponse) => {

            const ProxyFound = ProxiesResponse.data.find(Proxies => Proxies.domain_names[0] == domainData.domain);

            const AllCertificates = await getAllCertificates(ProxyInformation.url, ProxyToken);
            const CertificateFound = AllCertificates.data.find((element) => element.domain_names[0] == domainData.domain);

            // Jeśli znaleziono certyfikat na liście certyfikatów.
            if (CertificateFound == undefined) {
                await message.channel.send('[SYSTEM PROXY] Nie znaleziono certyfikatu dla domeny. Pomijam usunięcie certyfikatu.');
            } else {
                await message.channel.send('[SYSTEM PROXY] Znaleziono certyfikat dla domeny. Próba jego usunięcia.');

                await deleteCertificate(ProxyInformation.url, ProxyToken, domainData.domain, ProxiesResponse).then(async (Response) => {
                    await message.channel.send('[SYSTEM PROXY] Pomyślnie usunięto certyfikat dla domeny.');
                });
            }

            // Jeśli proxy zostało znalezione na liście proxy.
            if (ProxyFound == undefined) {
                await message.channel.send('[SYSTEM PROXY] Nie znaleziono domeny na liście proxy. Usuwam ją z bazy danych użytkownika.');

                await deleteDomainDB(message.author.id, domainData.domain).then(async (Response) => {
                    message.channel.send('[SYSTEM PROXY] Pomyślnie usunięto domenę z bazy danych użytkownika.');
                });
            } else {
                message.channel.send('[SYSTEM PROXY] Znaleziono domenę na liście proxy. Próba usunięcia z listy proxy.');

                await deleteProxy(ProxyInformation.url, ProxyToken, domainData.domain, ProxiesResponse).then(async (Response) => {
                    await message.channel.send('[SYSTEM PROXY] Pomyślnie usunięto domenę z listy proxy.');

                    await deleteDomainDB(message.author.id, domainData.domain).then(async (Response) => {
                        message.channel.send('[SYSTEM PROXY] Pomyślnie usunięto domenę z bazy danych użytkownika.');
                    });
                });
            }
        }).catch(Error => {
            console.error("[BŁĄD SYSTEMU PROXY]: " + Error);
        });

        // Domeny z starych proxy.
    } else if (domainData.Location == undefined || domainData.Location == "FR" || domainData.Location == "US") {
        message.channel.send("Ta domena pochodzi z starego systemu proxy. Usuwam z bazy danych.");

        await deleteDomainDB(message.author.id, domainData.domain).then(async (Response) => {
            message.channel.send('[SYSTEM PROXY] Pomyślnie usunięto domenę z bazy danych użytkownika.');
        });
    }
};