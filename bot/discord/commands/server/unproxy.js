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

async function getNewKeyDonator() {
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
                "domains`"
        );
        UnproxyEmbed.setTimestamp();
        UnproxyEmbed.setFooter("DanBot Hosting");

        await message.reply(UnproxyEmbed);

        //Arguement was provided.
    } else if (args[1]) {
        //User domain data.
        const userDomains = await userData.get(message.author.id + ".domains");

        //User wants to remove the domain from the database. No unproxy action.
        if (args[2] == "-db") {
            userData.set(
                message.author.id + ".domains",
                userDomains.filter((x) => x.domain != args[1].toLowerCase())
            );
            message.reply("Unlinked domain from the database.");

            //Doesn't want to remove from database, normal unproxy.
        } else {
            //Invalid domain provided.
            if (userDomains.find((x) => x.domain === args[1].toLowerCase()) == null) {
                message.reply(
                    "I could not find this domain! Please make sure you have entered a valid domain. A valid domain is `danbot.host`, whereas `https://danbot.host/` is not valid domain!"
                );
                return;
            }

            const domainData = userDomains.find((x) => x.domain === args[1].toLowerCase());

            //Checks which location the domain is located in.
            if (domainData.location == "US1") {
                config.USProxy1.authKey = await getUSNewKey1();

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
                                Response.data.find((element) => element.domain_names[0] == args[1].toLowerCase()).id,
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
                                    Response2.data.find((element) => element.domain_names[0] == args[1].toLowerCase())
                                        .id,
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
                                        .domains.filter((x) => x.domain != args[1].toLowerCase())
                                );

                                message.reply("Successfully unproxied the domain: `" + args[1] + "`");
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more,\nif the bot says its currently linked try adding `-db` to the end of the command."
                        );
                        console.log(error);
                    });
            } else if (domainData.location == "US2") {
                config.USProxy2.authKey = await getUSNewKey2();

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
                                Response.data.find((element) => element.domain_names[0] == args[1].toLowerCase()).id,
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
                                    Response2.data.find((element) => element.domain_names[0] == args[1].toLowerCase())
                                        .id,
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
                                        .domains.filter((x) => x.domain != args[1].toLowerCase())
                                );

                                message.reply("Successfully unproxied the domain: `" + args[1] + "`");
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more,\nif the bot says its currently linked try adding `-db` to the end of the command."
                        );
                        console.log(error);
                    });
            } else if (domainData.location == "US3") {
                config.USProxy3.authKey = await getUSNewKey3();

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
                                Response.data.find((element) => element.domain_names[0] == args[1].toLowerCase()).id,
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
                                    Response2.data.find((element) => element.domain_names[0] == args[1].toLowerCase())
                                        .id,
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
                                        .domains.filter((x) => x.domain != args[1].toLowerCase())
                                );

                                message.reply("Successfully unproxied the domain: `" + args[1] + "`");
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more,\nif the bot says its currently linked try adding `-db` to the end of the command."
                        );
                        console.log(error);
                    });
            } else if (domainData.location == "US4") {
                config.USProxy4.authKey = await getUSNewKey4();

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
                                Response.data.find((element) => element.domain_names[0] == args[1].toLowerCase()).id,
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
                                    Response2.data.find((element) => element.domain_names[0] == args[1].toLowerCase())
                                        .id,
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
                                        .domains.filter((x) => x.domain != args[1].toLowerCase())
                                );

                                message.reply("Successfully unproxied the domain: `" + args[1] + "`");
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more,\nif the bot says its currently linked try adding `-db` to the end of the command."
                        );
                        console.log(error);
                    });
            } else if (domainData.location == "Donator") {
                return message.reply("Donator proxy is disabled");
                //config.DonatorProxy.authKey = await getNewKeyDonator();

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
                    .then((response) => {
                        axios({
                            url:
                                config.DonatorProxy.url +
                                "/api/nginx/certificates/" +
                                response.data.find((element) => element.domain_names[0] == args[1].toLowerCase()).id,
                            method: "DELETE",
                            followRedirect: true,
                            maxRedirects: 5,
                            headers: {
                                Authorization: config.DonatorProxy.authKey,
                                "Content-Type": "application/json",
                            },
                        }).then((response2) => {
                            axios({
                                url:
                                    config.DonatorProxy.url +
                                    "/api/nginx/proxy-hosts/" +
                                    response2.data.find((element) => element.domain_names[0] == args[1].toLowerCase())
                                        .id,
                                method: "DELETE",
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    Authorization: config.DonatorProxy.authKey,
                                    "Content-Type": "application/json",
                                },
                            }).then((response3) => {
                                userData.set(
                                    message.author.id + ".domains",
                                    userData
                                        .get(message.author.id)
                                        .domains.filter((x) => x.domain != args[1].toLowerCase())
                                );

                                message.reply("Unproxied domain `" + args[1] + "`.");
                            });
                        });
                    })
                    .catch((error) => {
                        message.reply(
                            "There has been a error. Please contact Dan or try once more, \nIf the bot says its currently linked try adding `-db` to the end of the command."
                        );
                        console.log(error);
                    });
            }
        }
    }
};
