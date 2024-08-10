const Discord = require('discord.js');
const Config = require('../../../config.json');

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

exports.getNewKeyUS1 = () => getNewKey(Config.USProxy1);
exports.getNewKeyUS2 = () => getNewKey(Config.USProxy2);
exports.getNewKeyUS3 = () => getNewKey(Config.USProxy3);
exports.getNewKeyUS4 = () => getNewKey(Config.USProxy4);
exports.DonatorProxy = () => getNewKey(Config.DonatorProxy);

const proxyServers = [
    {
        name: "US1",
        getToken: getNewKeyUS1(),
        url: Config.USProxy1.url,
    },
    {
        name: "US2",
        getToken: getNewKeyUS2(),
        url: Config.USProxy2.url,
    },
    {
        name: "US3",
        getToken: getNewKeyUS3(),
        url: Config.USProxy3.url,
    },
    {
        name: "US4",
        getToken: getNewKeyUS4(),
        url: Config.USProxy4.url,
    },
    {
        name: "DonatorProxy",
        getToken: getNewKeyUS4(),
        url: Config.DonatorProxy.url,
    },
];

exports.description = "Removes a user domain manually.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot)) return;

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
