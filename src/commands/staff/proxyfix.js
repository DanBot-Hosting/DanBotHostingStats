const Discord = require('discord.js');

const Config = require('../../../config.json');
const Proxies = require('../../../config/proxy-configs.js').Proxies;

// Ta funkcja wygeneruje nowy token dla określonej lokalizacji.
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

exports.description = "Ręcznie usuwa domenę użytkownika.";

/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {

    if (!message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.Staff)) return;

    if (!args[1]) return message.channel.send("Proszę podać domenę.\n\n" + "OSTRZEŻENIE: Nie używaj tej komendy bez sprawdzenia, czy domena nie jest już powiązana!\n\n" + "**Ta komenda powinna być używana jako ostateczność, jeśli domena nie łączy się.**");


    const ReplyMessage = await message.channel.send("**Ta komenda powinna być używana jako ostateczność, jeśli domena nie łączy się.**\n\nPróbuję naprawić proxy...");

    let token;
    let using = false;
    let idOfProxy = null;

    ReplyMessage.edit(`Zautoryzowano, szukam hosta proxy...`);

    for (let i = 0; i < Proxies.length; i++) {
        const proxyServer = Proxies[i];

        token = await getToken(proxyServer.url, proxyServer.email, proxyServer.pass);

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
                i = Proxies.length;
            }
        }
    }

    if (!idOfProxy) {
        ReplyMessage.edit("DOMENA_NIE_ZNALEZIONA\nTa domena powinna działać, czy zrobiłeś literówkę?");
    } else {
        ReplyMessage.edit(
            `Znaleziono domenę ${idOfProxy} na ${Proxies[using].name}, próbuję usunąć...`,
        );

        const deletedObject = await axios({
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
                `Domena powinna teraz działać, upewnij się, że istnieje rekord DNS wskazujący na proxy DinoHost i Cloudflare proxy jest wyłączone, jeśli używasz Cloudflare.`,
            );
        } else {
            ReplyMessage.edit(
                `Znaleziono domenę ${idOfProxy} na ${Proxies[using].name}, nie udało się jej usunąć! Spróbuj ponownie?`,
            );
        }
    }

};