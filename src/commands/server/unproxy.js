//Generates new token for France Proxy server.
async function getUS1NewKey() {
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
async function getUS2NewKey() {
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
async function getUS3NewKey() {
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
async function getUS4NewKey() {
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
async function getUS5NewKey() {
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

exports.run = async (client, message, args) => {
    //No arguements were provided.
    if (!args[1]) {
        const UnproxyEmbed = new Discord.MessageEmbed();
        UnproxyEmbed.setTitle("**How to remove a domain from a server:**");
        UnproxyEmbed.setDescription(
            "Command format: `" +
                config.DiscordBot.Prefix +
                "server unproxy <domain>`\nReplace <domain> with your domain. You can find a list with all your proxied domains by running `" +
                config.DiscordBot.Prefix +
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
                config.USProxy1.authKey = await getUS1NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: config.USProxy1.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: config.USProxy1.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                config.USProxy1.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: config.USProxy1.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    config.USProxy1.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: config.USProxy1.authKey,
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
                        console.log(error);
                    });
            } else if (domainData.location == "US2") {
                //Generates new token for France Proxy location.
                config.USProxy2.authKey = await getUS2NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: config.USProxy2.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: config.USProxy2.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                config.USProxy2.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: config.USProxy2.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    config.USProxy2.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: config.USProxy2.authKey,
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
                        console.log(error);
                    });
            } else if (domainData.location == "US3") {
                //Generates new token for France Proxy location.
                config.USProxy3.authKey = await getUS3NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: config.USProxy3.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: config.USProxy3.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                config.USProxy3.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: config.USProxy3.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    config.USProxy3.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: config.USProxy3.authKey,
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
                        console.log(error);
                    });
            } else if (domainData.location == "US4") {
                //Generates new token for France Proxy location.
                config.USProxy4.authKey = await getUS4NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: config.USProxy4.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: config.USProxy4.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                config.USProxy4.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: config.USProxy4.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    config.USProxy4.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: config.USProxy4.authKey,
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
                        console.log(error);
                    });
            }
            if (domainData.location == "DonatorProxy") {
                //Generates new token for France Proxy location.
                config.DonatorProxy.authKey = await getUS5NewKey();

                //Starts looking for the proxy data. Then deletes certificate. Then deletes the proxy host. Finally removes it from database.
                await axios({
                    url: config.DonatorProxy.url + "/api/nginx/proxy-hosts",
                    method: "GET",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        Authorization: config.DonatorProxy.authKey,
                        "Content-Type": "application/json",
                    },
                })
                    .then((Response) => {
                        //Tries to find and delete a certificate.
                        axios({
                            url:
                                config.DonatorProxy.url +
                                "/api/nginx/certificates/" +
                                Response.data.find(
                                    (element) => element.domain_names[0] == args[1].toLowerCase(),
                                ).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: config.DonatorProxy.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((Response2) => {
                            //Tries to find and delete the actual proxy.
                            axios({
                                url:
                                    config.DonatorProxy.url +
                                    "/api/nginx/proxy-hosts/" +
                                    Response2.data.find(
                                        (element) =>
                                            element.domain_names[0] == args[1].toLowerCase(),
                                    ).id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: config.DonatorProxy.authKey,
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
                        console.log(error);
                    });
            }
    }
};

exports.description = "Unproxies a domain from a server.";