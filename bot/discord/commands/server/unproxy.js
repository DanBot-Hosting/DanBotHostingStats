const sshClient = require("ssh2").Client;
exports.run = async (client, message, args) => {
  if (!args[1]) {
    const embed = new Discord.MessageEmbed().setTitle(
      "__**How to remove a domain from a server**__ \nCommand format: " +
        config.DiscordBot.Prefix +
        "server unproxy domainhere"
    );
    message.channel.send(embed);
  } else if (!args[2]) {
    if (
      userData
        .get(message.author.id)
        .domains.find((x) => x.domain === args[1].toLowerCase()) == null
    ) {
      message.channel.send("that domain isnt linked.");
      return;
    }

    //SSH Connection
    let conn = new sshClient();
    conn
      .on("ready", function () {
        console.log("SSH: ready");
      })
      .connect({
        host: config.SSH.Host,
        port: config.SSH.Port,
        username: config.SSH.User,
        password: config.SSH.Password,
      });

    conn.on("ready", function () {
      conn.exec(
        "rm /etc/apache2/sites-enabled/" +
          args[1] +
          '.conf && service apache2 restart && sleep 1 && echo "complete"',
        function (err, stream) {
          if (err) throw err;
          stream
            .on("close", function (code, signal) {
              conn.end();
            })
            .on("data", function (data) {
              message.channel.send("Proxy has been removed from " + args[1]);
              userData.set(
                message.author.id + ".domains",
                userData
                  .get(message.author.id)
                  .domains.filter((x) => x.domain != args[1].toLowerCase())
              );
            })
            .stderr.on("data", function (data) {
              message.channel.send(
                "FAILED. **Try using `-force` to force unproxy after the server ID** \nERROR: " +
                  data
              );
            });
        }
      );
    });
  } else if (args[2] === "-force") {
    if (
      userData
        .get(message.author.id)
        .domains.find((x) => x.domain === args[1].toLowerCase()) == null
    ) {
      message.channel.send("that domain isnt linked.");
      return;
    }

    //SSH Connection
    let conn = new sshClient();
    conn
      .on("ready", function () {
        console.log("SSH: ready");
      })
      .connect({
        host: config.SSH.Host,
        port: config.SSH.Port,
        username: config.SSH.User,
        password: config.SSH.Password,
      });

    conn.on("ready", function () {
      conn.exec(
        "rm /etc/apache2/sites-enabled/" +
          args[1] +
          '.conf && service apache2 restart && sleep 1 && echo "complete"',
        function (err, stream) {
          if (err) throw err;
          stream
            .on("close", function (code, signal) {
              conn.end();
            })
            .on("data", function (data) {
              message.channel.send("Proxy has been removed from " + args[1]);
              userData.set(
                message.author.id + ".domains",
                userData
                  .get(message.author.id)
                  .domains.filter((x) => x.domain != args[1].toLowerCase())
              );
            })
            .stderr.on("data", function (data) {
              userData.set(
                message.author.id + ".domains",
                userData
                  .get(message.author.id)
                  .domains.filter((x) => x.domain != args[1].toLowerCase())
              );
              message.channel.send("Proxy has been removed from " + args[1]);
            });
        }
      );
    });
  }
};
