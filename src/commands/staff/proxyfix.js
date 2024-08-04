async function getNewKeyUS1() {
    const serverRes = await axios({
        url: config.USProxy1.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.USProxy1.email,
            secret: config.USProxy1.pass,
        },
    });
    return "Bearer " + serverRes.data.token;
}

async function getNewKeyUS2() {
    const serverRes = await axios({
        url: config.USProxy2.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.USProxy2.email,
            secret: config.USProxy2.pass,
        },
    });
    return "Bearer " + serverRes.data.token;
}

async function getNewKeyUS3() {
    const serverRes = await axios({
        url: config.USProxy3.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.USProxy3.email,
            secret: config.USProxy3.pass,
        },
    });
    return "Bearer " + serverRes.data.token;
}

async function getNewKeyUS4() {
    const serverRes = await axios({
        url: config.USProxy4.url + "/api/tokens",
        method: "POST",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            identity: config.USProxy4.email,
            secret: config.USProxy4.pass,
        },
    });
    return "Bearer " + serverRes.data.token;
}

async function DonatorProxy() {
    const serverRes = await axios({
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
    return "Bearer " + serverRes.data.token;
}

const proxyServers = [
    {
        name: "USProxy1",
        getToken: getNewKeyUS1,
        url: config.USProxy1.url,
    },
    {
        name: "USProxy2",
        getToken: getNewKeyUS2,
        url: config.USProxy2.url,
    },
    {
        name: "USProxy3",
        getToken: getNewKeyUS3,
        url: config.USProxy3.url,
    },
    {
        name: "USProxy4",
        getToken: getNewKeyUS4,
        url: config.USProxy4.url,
    },
    {
        name: "Donator",
        getToken: DonatorProxy,
        url: config.DonatorProxy.url,
    },
];

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "898041751099539497")) return;

    if (!args[1]) {
        return message.reply(
            "Please provide a URL! WARNING: Do not use this command without checking the domain is not already linked! \n\n**This command should be used as a last resort if the domain is not linking.**",
        );
    } else {
        const replyMsg = await message.channel.send(
            "**This command should be used as a last resort if the domain is not linking.**\nTrying to fix proxy...",
        );

        let token;
        let using = false;
        let idOfProxy = null;

        replyMsg.edit(`Authenticated, looking for proxy host...`);

        for (let i = 0; i < proxyServers.length; i++) {
            const proxyServer = proxyServers[i];

            token = await proxyServer.getToken();

            const listOfUrls = await axios({
                url:
                    proxyServer.url + "/api/nginx/proxy-hosts?expand=owner,access_list,certificate",
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
            replyMsg.edit("DOMAIN_NOT_FOUND\nThis domain should work, did you make a typo?");
        } else {
            replyMsg.edit(
                `Found domain ${idOfProxy} on ${proxyServers[using].name}, attempting to delete...`,
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
                    `The domain should now work, please ensure there is a DNS record pointing to the DBH proxy and Cloudflare proxy is disabled if you are using Cloudflare.`,
                );
            } else {
                replyMsg.edit(
                    `Found domain ${idOfProxy} on ${proxyServers[using].name}, failed to delete! Try again?`,
                );
            }
        }
    }
};
