async function getNewKeyFR() {
    const serverResFR = await axios({
        url: config.FRProxy.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.FRProxy.email,
            secret: config.FRProxy.pass,
        },
    });
    return "Bearer " + serverResFR.data.token;
}

async function getNewKeyCA() {
    const serverResCA = await axios({
        url: config.CAProxy.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.CAProxy.email,
            secret: config.CAProxy.pass,
        },
    });
    return "Bearer " + serverResCA.data.token;
}

async function getNewKeyDono() {
    const serverResDono = await axios({
        url: config.DonatorProxy.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.DonatorProxy.email,
            secret: config.DonatorProxy.pass,
        },
    });
    return "Bearer " + serverResDono.data.token;
}

const proxyServers = [
    {
        name: "FR",
        getToken: getNewKeyFR,
        url: config.FRProxy.url,
    },
    {
        name: "CA",
        getToken: getNewKeyCA,
        url: config.CAProxy.url,
    },
    {
        name: "Donator",
        getToken: getNewKeyDono,
        url: config.DonoProxy.url,
    },
];

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "898041751099539497")) return;

    if (!args[1]) {
        return message.reply(
            "Please provide a URL! WARNING: Do not use this command without checking the domain is not already linked! \n\n**This command should be used as a last resort if the domain is not linking.**"
        );
    } else {
        const replyMsg = await message.channel.send("**This command should be used as a last resort if the domain is not linking.**\nTrying to fix proxy...");

        let token;
        let using = false;
        let idOfProxy = null;

        replyMsg.edit(`Authenticated, looking for proxy host...`);

        for (let i = 0; i < proxyServers.length; i++) {
            const proxyServer = proxyServers[i];

            token = await proxyServer.getToken();

            const listOfUrls = await axios({
                url: proxyServer.url + "/api/nginx/proxy-hosts?expand=owner,access_list,certificate",
                method: "GET",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });

            for (let index = 0; index < listOfUrls.data.length; index++) {
                const proxyObject = listOfUrls.data[index];
                if (proxyObject.domain_names.includes(args[1])) {
                    idOfProxy = proxyObject.id;
                    using = i;
                    i = proxyServers.length;
                }
            }
        }

        if (!idOfProxy) {
            replyMsg.edit(
                "DOMAIN_NOT_FOUND\nThis domain should work, did you make a typo?"
            );
        } else {
            replyMsg.edit(
                `Found domain ${idOfProxy} on ${proxyServers[using].name}, attempting to delete...`
            );

            const deletedObject = await axios({
                url: proxyServers[using].url + `/api/nginx/proxy-hosts/${idOfProxy}`,
                method: "DELETE",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });

            if (deletedObject) {
                replyMsg.edit(
                    `The domain should now work, please ensure there is a DNS record pointing to the DBH proxy and Cloudflare proxy is disabled if you are using Cloudflare.`
                );
            } else {
                replyMsg.edit(
                    `Found domain ${idOfProxy} on ${proxyServers[using].name}, failed to delete! Try again?`
                );
            }
        }
    }
};
