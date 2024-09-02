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

exports.description = "Removes a user domain manually.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    if (!args[1]) return message.channel.send("Please provide a domain.\n\n" + "WARNING: Do not use this command without checking if the domain is not already linked!\n\n" + "**This command should be used as a last resort if the domain is not linking.**");

    
    const ReplyMessage = await message.channel.send("**This command should be used as a last resort if the domain is not linking.**\n\nTrying to fix proxy...");

    let token;
    let using = false;
    let idOfProxy = null;

    ReplyMessage.edit(`Authenticated, looking for proxy host...`);

    for (let i = 0; i < Proxies.length; i++) {
        const proxyServer = Proxies[i];

        token = await getToken(proxyServer.url, proxyServer.email, proxyServer.pass);

        const listOfUrls = await Axios({
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
                    i = Proxies.length;
                }
            }
        }

        if (!idOfProxy) {
            ReplyMessage.edit("DOMAIN_NOT_FOUND\nThis domain should work, did you make a typo?");
        } else {
            ReplyMessage.edit(
                `Found domain ${idOfProxy} on ${Proxies[using].name}, attempting to delete...`,
            );

            const deletedObject = await Axios({
                url: Proxies[using].url + `/api/nginx/proxy-hosts/${idOfProxy}`,
                method: "DELETE",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });

            if (deletedObject) {
                ReplyMessage.edit(
                    `The domain should now work, please ensure there is a DNS record pointing to the DBH proxy and Cloudflare proxy is disabled if you are using Cloudflare.`,
                );
            } else {
                ReplyMessage.edit(
                    `Found domain ${idOfProxy} on ${Proxies[using].name}, failed to delete! Try again?`,
                );
            };
        }
    
};
