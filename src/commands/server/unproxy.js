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

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    //No arguements were provided.
    if (!args[1]) {
        const UnproxyEmbed = new Discord.MessageEmbed();
        UnproxyEmbed.setTitle("**How to remove a domain from a server:**");
        UnproxyEmbed.setDescription(
            "Command format: `" +
                Config.DiscordBot.Prefix +
                "server unproxy <domain>`\nReplace <domain> with your domain. You can find a list with all your proxied domains by running `" +
                Config.DiscordBot.Prefix +
                "domains`",
        );
        UnproxyEmbed.setTimestamp();
        UnproxyEmbed.setFooter("DanBot Hosting");

        await message.reply(UnproxyEmbed);

        //Arguement was provided.
    } else if (args[1]) {
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

            //Checks which location the domain is located in.
            if (domainData.location == "US1") {
                //Generates new token for France Proxy location.
                Config.USProxy1.authKey = await getUS1NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: Config.USProxy1.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: Config.USProxy1.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                Config.USProxy1.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: Config.USProxy1.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    Config.USProxy1.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: Config.USProxy1.authKey,
                                    "Content-Type": "application/json",
                                },

                                //Updates user database with the removed domain.
                            }).then((response3) => {
                                userData.set(
                                    message.author.id + ".domains",
                                    userData
                                        .get(message.author.id)
                                        .domains.filter((x) => x.domain != args[1].toLowerCase()),
                                );

                                message.reply(
                                    "Successfully unproxied the domain: `" + args[1] + "`",
                                );
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command.",
                        );
                        console.error(error);
                    });
            } else if (domainData.location == "US2") {
                //Generates new token for France Proxy location.
                Config.USProxy2.authKey = await getUS2NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: Config.USProxy2.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: Config.USProxy2.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                Config.USProxy2.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: Config.USProxy2.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    Config.USProxy2.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: Config.USProxy2.authKey,
                                    "Content-Type": "application/json",
                                },

                                //Updates user database with the removed domain.
                            }).then((response3) => {
                                userData.set(
                                    message.author.id + ".domains",
                                    userData
                                        .get(message.author.id)
                                        .domains.filter((x) => x.domain != args[1].toLowerCase()),
                                );

                                message.reply(
                                    "Successfully unproxied the domain: `" + args[1] + "`",
                                );
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command.",
                        );
                        console.error(error);
                    });
            } else if (domainData.location == "US3") {
                //Generates new token for France Proxy location.
                Config.USProxy3.authKey = await getUS3NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: Config.USProxy3.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: Config.USProxy3.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                Config.USProxy3.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: Config.USProxy3.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    Config.USProxy3.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: Config.USProxy3.authKey,
                                    "Content-Type": "application/json",
                                },

                                //Updates user database with the removed domain.
                            }).then((response3) => {
                                userData.set(
                                    message.author.id + ".domains",
                                    userData
                                        .get(message.author.id)
                                        .domains.filter((x) => x.domain != args[1].toLowerCase()),
                                );

                                message.reply(
                                    "Successfully unproxied the domain: `" + args[1] + "`",
                                );
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command.",
                        );
                        console.error(error);
                    });
            } else if (domainData.location == "US4") {
                //Generates new token for France Proxy location.
                Config.USProxy4.authKey = await getUS4NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: Config.USProxy4.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: Config.USProxy4.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                Config.USProxy4.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: Config.USProxy4.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    Config.USProxy4.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: Config.USProxy4.authKey,
                                    "Content-Type": "application/json",
                                },

                                //Updates user database with the removed domain.
                            }).then((response3) => {
                                userData.set(
                                    message.author.id + ".domains",
                                    userData
                                        .get(message.author.id)
                                        .domains.filter((x) => x.domain != args[1].toLowerCase()),
                                );

                                message.reply(
                                    "Successfully unproxied the domain: `" + args[1] + "`",
                                );
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command.",
                        );
                        console.error(error);
                    });
            }
            if (domainData.location == "DonatorProxy") {
                //Generates new token for France Proxy location.
                Config.DonatorProxy.authKey = await getUS5NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: Config.DonatorProxy.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: Config.DonatorProxy.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                Config.DonatorProxy.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: Config.DonatorProxy.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    Config.DonatorProxy.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: Config.DonatorProxy.authKey,
                                    "Content-Type": "application/json",
                                },

                                //Updates user database with the removed domain.
                            }).then((response3) => {
                                userData.set(
                                    message.author.id + ".domains",
                                    userData
                                        .get(message.author.id)
                                        .domains.filter((x) => x.domain != args[1].toLowerCase()),
                                );

                                message.reply(
                                    "Successfully unproxied the domain: `" + args[1] + "`",
                                );
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command.",
                        );
                        console.error(error);
                    });
            }
    }
};

exports.description = "Unproxies a domain from a server.";