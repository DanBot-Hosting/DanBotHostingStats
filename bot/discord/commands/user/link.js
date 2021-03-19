const axios = require("axios");
exports.run = async (client, message, args) => {
  if (userData.get(message.author.id) == null) {
    const server = message.guild;

    let channel = await server.channels
      .create(message.author.tag, "text", [
        {
          type: "role",
          id: message.guild.id,
          deny: 0x400,
        },
        {
          type: "user",
          id: message.author.id,
          deny: 1024,
        },
      ])
      .catch(console.error);
    message.reply(`Please check <#${channel.id}> to link your account.`);

    let category = server.channels.cache.find(
      (c) => c.id === "738539016688894024" && c.type === "category"
    );
    if (!category) throw new Error("Category channel does not exist");

    await channel.setParent(category.id);

    channel.updateOverwrite(message.author, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      READ_MESSAGE_HISTORY: true,
    });

    let msg = await channel.send(message.author, {
      embed: new Discord.MessageEmbed()
        .setColor(0x36393e)
        .setDescription("Please enter your console email address")
        .setFooter(
          "You can type 'cancel' to cancel the request \n**This will take a few seconds to find your account.**"
        ),
    });

    const collector = new Discord.MessageCollector(
      channel,
      (m) => m.author.id === message.author.id,
      {
        time: 60000,
        max: 1,
      }
    );
    collector.on("collect", (messagecollected) => {
      //console.log(message.content)

      if (messagecollected.content === "cancel") {
        return msg
          .edit("Request to link your account canceled.", null)
          .then(channel.delete());
      }

      const axios = require("axios");
      let arr = [];

      axios({
        url: "https://panel.danbot.host" + "/api/application/users",
        method: "GET",
        followRedirect: true,
        maxRedirects: 5,
        headers: {
          Authorization: "Bearer " + config.Pterodactyl.apikey,
          "Content-Type": "application/json",
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
      }).then((resources) => {
        let countmax = resources.data.meta.pagination.total_pages;
        let i2 = countmax++;

        let i = 0;
        while (i < i2) {
          axios({
            url:
              "https://panel.danbot.host" + "/api/application/users?page=" + i,
            method: "GET",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
              Authorization: "Bearer " + config.Pterodactyl.apikey,
              "Content-Type": "application/json",
              Accept: "Application/vnd.pterodactyl.v1+json",
            },
          }).then((response) => {
            arr.push(...response.data.data);
          });
          i++;
        }
        console.log(resources.data.meta.pagination);
        let total = resources.data.meta.pagination.total;
      });
      //Find account then link
      setTimeout(async () => {
        console.log(arr.length);
        const consoleUser = arr.find((usr) =>
          usr.attributes
            ? usr.attributes.email === messagecollected.content
            : false
        );

        if (!consoleUser) {
          channel.send(
            "I can't find a user with that account! \nRemoving channel!"
          );
          setTimeout(() => {
            channel.delete();
          }, 5000);
        } else {
          function codegen(length) {
            let result = "";
            let characters = "23456789";
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result;
          }
          const code = codegen(10);

          const emailmessage = {
            from: config.Email.From,
            to: messagecollected.content,
            subject:
              "DanBot Hosting - Someone tried to link their Discord account!",
            html:
              "Hello, " +
              message.author.username +
              " (ID: " +
              message.author.id +
              ") just tried to link their Discord account with this console email address. Here is a verification code that is needed to link: " +
              code,
          };
          transport.sendMail(emailmessage, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log(info);
              channel.send(
                "Please check the email account for a verification code to complete linking. You have 2mins"
              );

              const collector = new Discord.MessageCollector(
                channel,
                (m) => m.author.id === message.author.id,
                {
                  time: 120000,
                  max: 2,
                }
              );
              collector.on("collect", (message) => {
                if (message.content === code) {
                  const timestamp = `${moment().format("HH:mm:ss")}`;
                  const datestamp = `${moment().format("YYYY-MM-DD")}`;
                  userData.set(`${message.author.id}`, {
                    discordID: message.author.id,
                    consoleID: consoleUser.attributes.id,
                    email: consoleUser.attributes.email,
                    username: consoleUser.attributes.username,
                    linkTime: timestamp,
                    linkDate: datestamp,
                    domains: [],
                  });

                  let embedstaff = new Discord.MessageEmbed()
                    .setColor("Green")
                    .addField(
                      "__**Linked Discord account:**__",
                      message.author.id
                    )
                    .addField(
                      "__**Linked Console account email:**__",
                      consoleUser.attributes.email
                    )
                    .addField(
                      "__**Linked At: (TIME / DATE)**__",
                      timestamp + " / " + datestamp
                    )
                    .addField(
                      "__**Linked Console username:**__",
                      consoleUser.attributes.username
                    )
                    .addField(
                      "__**Linked Console ID:**__",
                      consoleUser.attributes.id
                    );

                  channel.send("Account linked!").then(
                    client.channels
                      .get(config.DiscordBot.oLogs)
                      .send(
                        `<@${message.author.id}> linked their account. Heres some info: `,
                        embedstaff
                      ),
                    setTimeout(() => {
                      channel.delete();
                    }, 5000)
                  );
                } else {
                  channel.send(
                    "Code is incorrect. Linking cancelled! \n\nRemoving channel!"
                  );
                  setTimeout(() => {
                    channel.delete();
                  }, 2000);
                }
              });
            }
          });
        }
      }, 10000);
    });
  } else {
    let embed = new Discord.MessageEmbed()
      .setColor(`GREEN`)
      .addField(
        `__**Username**__`,
        userData.fetch(message.author.id + ".username")
      )
      .addField(
        `__**Linked Date (DD/MM/YY)**__`,
        userData.fetch(message.author.id + ".linkDate")
      )
      .addField(
        `__**Linked Time**__`,
        userData.fetch(message.author.id + ".linkTime")
      );
    await message.channel.send("This account is linked!", embed);
  }
};
