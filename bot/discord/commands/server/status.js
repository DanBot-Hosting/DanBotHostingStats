const axios = require("axios");
const pretty = require("prettysize");
exports.run = async (client, message, args) => {
  if (!args[0]) {
    let embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .addField(
        "__**Server Status**__",
        "What server would you like to view? \nCommand Format: `" +
          config.DiscordBot.Prefix +
          "server status serverid"
      );
    await message.channel.send(embed);
  } else {
    message.channel
      .send("Fetching `" + args[1] + "`. \n\n*This could take a few seconds*")
      .then((msg) => {
        axios({
          url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[1],
          method: "GET",
          followRedirect: true,
          maxRedirects: 5,
          headers: {
            Authorization: "Bearer " + config.Pterodactyl.apikeyclient,
            "Content-Type": "application/json",
            Accept: "Application/vnd.pterodactyl.v1+json",
          },
        })
          .then((response) => {
            axios({
              url:
                config.Pterodactyl.hosturl +
                "/api/client/servers/" +
                args[1] +
                "/resources",
              method: "GET",
              followRedirect: true,
              maxRedirects: 5,
              headers: {
                Authorization: "Bearer " + config.Pterodactyl.apikeyclient,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
              },
            }).then((resources) => {
              let embedstatus = new Discord.MessageEmbed()
                .setColor("GREEN")
                .addField(
                  "**Status**",
                  resources.data.attributes.current_state,
                  true
                )
                .addField(
                  "**CPU Usage**",
                  resources.data.attributes.resources.cpu_absolute + "%"
                )
                .addField(
                  "**RAM Usage**",
                  pretty(resources.data.attributes.resources.memory_bytes) +
                    "  out of UNLIMITED MB"
                )
                .addField(
                  "**DISK Usage**",
                  pretty(resources.data.attributes.resources.disk_bytes) +
                    "  out of UNLIMITED MB"
                )
                .addField(
                  "**NET Usage**",
                  "UPLOADED: " +
                    pretty(
                      resources.data.attributes.resources.network_tx_bytes
                    ) +
                    ", DOWNLOADED: " +
                    pretty(resources.data.attributes.resources.network_rx_bytes)
                )
                .addField("**NODE**", response.data.attributes.node)
                .addField("**FULL ID**", response.data.attributes.uuid)
                .setTitle(
                  "🟢 Start | 🔄 Restart | 🔴 Stop \nReactions work for 20seconds."
                );
              msg.edit("<@" + message.author.id + ">", embedstatus);
              setTimeout(() => {
                msg.react("🟢");
                setTimeout(() => {
                  msg.react("🔄");
                  setTimeout(() => {
                    msg.react("🔴");
                  }, 200);
                }, 200);
              }, 200);

              const filter = (reaction, user) =>
                ["🟢", "🔄", "🔴"].includes(reaction.emoji.name) &&
                user.id === message.author.id;
              const collector = msg.createReactionCollector(filter, {
                time: 20000,
              });
              collector.on("collect", async (reaction, user) => {
                if (reaction.emoji.name === "🟢") {
                  axios({
                    url:
                      config.Pterodactyl.hosturl +
                      "/api/client/servers/" +
                      args[1] +
                      "/power",
                    method: "POST",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                      Authorization:
                        "Bearer " + config.Pterodactyl.apikeyclient,
                      "Content-Type": "application/json",
                      Accept: "Application/vnd.pterodactyl.v1+json",
                    },
                    data: { signal: "start" },
                  }).then((response) => {
                    message.reply(args[1] + " server started!").then((msg2) => {
                      setTimeout(() => {
                        msg2.delete();
                      }, 2000);
                    });
                  });
                } else if (reaction.emoji.name === "🔄") {
                  axios({
                    url:
                      config.Pterodactyl.hosturl +
                      "/api/client/servers/" +
                      args[1] +
                      "/power",
                    method: "POST",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                      Authorization:
                        "Bearer " + config.Pterodactyl.apikeyclient,
                      "Content-Type": "application/json",
                      Accept: "Application/vnd.pterodactyl.v1+json",
                    },
                    data: { signal: "kill" },
                  }).then((response) => {
                    setTimeout(() => {
                      axios({
                        url:
                          config.Pterodactyl.hosturl +
                          "/api/client/servers/" +
                          args[1] +
                          "/power",
                        method: "POST",
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                          Authorization:
                            "Bearer " + config.Pterodactyl.apikeyclient,
                          "Content-Type": "application/json",
                          Accept: "Application/vnd.pterodactyl.v1+json",
                        },
                        data: { signal: "start" },
                      }).then((response) => {
                        message
                          .reply(args[1] + " server restarted!")
                          .then((msg2) => {
                            setTimeout(() => {
                              msg2.delete();
                            }, 2000);
                          });
                      });
                    }, 500);
                  });
                } else if (reaction.emoji.name === "🔴") {
                  axios({
                    url:
                      config.Pterodactyl.hosturl +
                      "/api/client/servers/" +
                      args[1] +
                      "/power",
                    method: "POST",
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                      Authorization:
                        "Bearer " + config.Pterodactyl.apikeyclient,
                      "Content-Type": "application/json",
                      Accept: "Application/vnd.pterodactyl.v1+json",
                    },
                    data: { signal: "kill" },
                  }).then((response) => {
                    message.reply(args[1] + " server stopped!").then((msg2) => {
                      setTimeout(() => {
                        msg2.delete();
                      }, 2000);
                    });
                  });
                }
              });

              collector.on("end", () => {
                msg.reactions.removeAll();
              });
            });
          })
          .catch((error) => {
            msg.edit("Error: Can't find a server with that ID!");
          });
      });
  }
};
