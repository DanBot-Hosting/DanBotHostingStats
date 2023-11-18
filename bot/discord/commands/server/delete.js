const axios = require("axios");
const humanizeDuration = require("humanize-duration");

exports.run = async (client, message, args) => {
    if (client.cooldown[message.author.id] == null) {
        client.cooldown[message.author.id] = {
            nCreate: null,
            pCreate: null,
            delete: null,
        };
    }

    if (client.cooldown[message.author.id].delete > Date.now()) {
        message.reply(
            `You're currently on cooldown, please wait ${humanizeDuration(
                client.cooldown[message.author.id].delete - Date.now(),
                { round: true }
            )}`
        );
        return;
    }

    client.cooldown[message.author.id].delete = Date.now() + 3 * 1000;

    if (!args[1]) {
        message.reply("Command format: `" + config.DiscordBot.Prefix + "server delete <serverid>`");
    } else {
        if (args[1].match(/[0-9a-z]+/i) == null) return message.reply("Please only use English characters.");

        args[1] = args[1].replace("https://panel.danbot.host/server/", "").match(/[0-9a-z]+/i)[0];

        message.reply("Please wait while the server `" + args[1] + "` is checked.").then((msg) => {
            axios({
                url:
                    "https://panel.danbot.host" +
                    "/api/application/users/" +
                    userData.get(message.author.id).consoleID +
                    "?include=servers",
                method: "GET",
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    Authorization: "Bearer " + config.Pterodactyl.apikey,
                    "Content-Type": "application/json",
                    Accept: "Application/vnd.pterodactyl.v1+json",
                },
            }).then(async (response) => {
                const preoutput = response.data.attributes.relationships.servers.data;
                const output = preoutput.find((srv) => (srv.attributes ? srv.attributes.identifier == args[1] : false));

                if (!output) {
                    msg.edit("I cannot find that server.");
                } else {
                    if (output.attributes.user === userData.get(message.author.id).consoleID) {
                        // msg.edit(
                        //     "Are you sure you want to delete `" +
                        //         output.attributes.name.split("@").join("@​") + // Uses an invisible character (U+200B) after the @
                        //         "`?\nPlease type `confirm` to delete this server. You have 1 minute until this prompt will expire.\n\n**You can not restore the server once it has been deleted and/or its files**"
                        // );

                        // const collector = await message.channel.createMessageCollector(
                        //     (m) => m.author.id === message.author.id,
                        //     {
                        //         time: 60000,
                        //         max: 2,
                        //     }
                        // );
                        // collector.on("collect", (message) => {
                        //     if (message.content === "confirm") {
                        //         message.delete();
                                msg.edit("Working...");
                                axios({
                                    url:
                                        config.Pterodactyl.hosturl +
                                        "/api/application/servers/" +
                                        output.attributes.id +
                                        "/force",
                                    method: "DELETE",
                                    followRedirect: true,
                                    maxRedirects: 5,
                                    headers: {
                                        Authorization: "Bearer " + config.Pterodactyl.apikey,
                                        "Content-Type": "application/json",
                                        Accept: "Application/vnd.pterodactyl.v1+json",
                                    },
                                })
                                    .then((response) => {
                                        msg.edit("Server deleted!");

                                        if (
                                            output.attributes.node === 31 ||
                                            output.attributes.node === 33 ||
                                            output.attributes.node === 34 ||
                                            output.attributes.node === 35 ||
                                            output.attributes.node === 39
                                        )
                                            userPrem.set(
                                                message.author.id + ".used",
                                                userPrem.fetch(message.author.id).used - 1
                                            );

                                        // collector.stop();
                                    })
                                    .catch((err) => {
                                        msg.edit("An error occurred with the Panel. Please try again later.");
                                        // collector.stop();
                                    });
                            // } else {
                            //     message.delete();
                            //     msg.edit("Request cancelled!");
                            //     collector.stop();
                            // }
                        });
                    } else {
                        msg.edit("You do not own that server so you cannot delete it.");
                    }
                }
            })
            .catch(() => msg.edit("An error occurred while fetching that server."))
        });
    }
};
