const Discord = require('discord.js');
const Axios = require('axios');

const Config = require('../../../config.json');
const Proxies = require('../../../config/proxy-configs.js').Proxies;

//This function will generate a new token for the specified location.
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

//This function will delete the certificate for a domain.
async function deleteCertificate(Url, Token, Domain, ProxiesResponse){

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

//This function will delete a proxy for a domain.
async function deleteProxy(Url, Token, Domain, ProxiesResponse){
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
    })
}

//This function requests all the certificates for a domain.
async function getAllCertificates(Url, Token){
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

//Removes a domain from the user's database.
async function deleteDomainDB(UserId, Domain){
    userData.set(
        UserId + ".domains",
        userData
            .get(UserId)
            .domains.filter((x) => x.domain != Domain),
    );

    return true;
}

exports.description = "Unproxies a domain from a server.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    const UnproxyEmbed = new Discord.MessageEmbed();
    UnproxyEmbed.setTitle("**Unproxying Domain from DBH server:**");
    UnproxyEmbed.setColor('BLUE')
    UnproxyEmbed.setDescription(
        "\n\nSyntax for Command: ```" +
            Config.DiscordBot.Prefix +
            "server unproxy <DOMAIN>```\n" + 
            "- Replace `<DOMAIN>` with your domain. E.g. `example.danbot.host`\n" + 
            "- You can find a list with all your proxied domains with: `" +
            Config.DiscordBot.Prefix +
            "user domains`",
    );
    UnproxyEmbed.setTimestamp();
    UnproxyEmbed.setFooter("DanBot Hosting");

    //No arguments were provided.
    if(!args[1]) return await message.channel.send(UnproxyEmbed);

    //User domain data.
    const userDomains = await userData.get(message.author.id + ".domains");

    //Invalid domain provided.
    if (userDomains.find((x) => x.domain === args[1].toLowerCase()) == null) {
        message.reply(
            "I could not find this domain! Please make sure you have entered a valid domain. A valid domain is `danbot.host`, `https://danbot.host/` is not valid domain!",
        );
        return;
    }

    const domainData = userDomains.find((x) => x.domain === args[1].toLowerCase());

    if (Proxies.map(x => x.dbLocation).includes(domainData.location)) {

        //This will contain the proxy information needed to continue.
        const ProxyInformation = Proxies.find(x => x.dbLocation == domainData.location);

        //Generate an new token for the specified location.
        const ProxyToken = await getToken(ProxyInformation.url, ProxyInformation.email, ProxyInformation.pass);

        // Gets a list of all the proxies.
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

            //If the certificate was found in the certificate list.
            if (CertificateFound == undefined) {
                await message.channel.send('[PROXY SYSTEM] Could not find the certificate for the domain. Skipping deletion of certificate.');
            } else {
                await message.channel.send('[PROXY SYSTEM] Found the certificate for the domain. Attempting to delete it.');

                await deleteCertificate(ProxyInformation.url, ProxyToken, domainData.domain, ProxiesResponse).then(async (Response) => {
                    await message.channel.send('[PROXY SYSTEM] Successfully removed the certificate for the domain.');
                });
            }

            // If the proxy was found in the proxy list.
            if (ProxyFound == undefined) {
                await messsage.channel.send('[PROXY SYSTEM] Could not find the domain in the proxy list. Removing it from user database.');

                await deleteDomainDB(message.author.id, domainData.domain).then(async (Response) => {
                    message.channel.send('[PROXY SYSTEM] Successfully removed the domain from the user database.');
                });
            } else {
                message.channel.send('[PROXY SYSTEM] Found the domain in the proxy list. Attempting to delete from proxy list.');

                await deleteProxy(ProxyInformation.url, ProxyToken, domainData.domain, ProxiesResponse).then(async (Response) => {
                    await message.channel.send('[PROXY SYSTEM] Successfully removed the domain from the proxy list.');

                    await deleteDomainDB(message.author.id, domainData.domain).then(async (Response) => {
                        message.channel.send('[PROXY SYSTEM] Successfully removed the domain from the user database.');
                    });
                });
            }
        }).catch(Error => {
            console.error("[PROXY SYSTEM ERROR]: " + Error);
        });
    
    //Domains from old proxies.
    } else if (domainData.Location == undefined || domainData.Location == "FR" || domainData.Location == "US") {
        message.channel.send("This domain is from an old proxy system. Removing from your Database.");
        
        await deleteDomainDB(message.author.id, domainData.domain).then(async (Response) => {
            message.channel.send('[PROXY SYSTEM] Successfully removed the domain from the user database.');
        });
    }
};