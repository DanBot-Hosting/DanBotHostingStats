const Discord = require("discord.js");
const Chalk = require("chalk");
const { exec } = require("child_process");

const ServerStatus = require("../serverStatus.js");
const Config = require("../../config.json");
const MiscConfigs = require("../../config/misc-configs.js");

/**
 * @param {Discord.Client} client
 */
module.exports = async (client) => {
  const guild = client.guilds.cache.get(Config.DiscordBot.MainGuildId);

  const checkNicks = () => {
    guild.members.cache
      .filter((member) => member.displayName.match(/^[a-z0-9]/i) == null)
      .forEach((x) => {
        x.setNickname("I love Dan <3");
      });
  };

  const deleteOldChannels = () => {
    guild.channels.cache
      .filter(
        (x) =>
          x.parentId === MiscConfigs.accounts &&
          Date.now() - x.createdAt.getTime() > 30 * 60 * 1000
      )
      .forEach((x) => x.delete());
  };

  client.user.setPresence({
    activities: [{ name: "over DBH", type: Discord.ActivityType.Watching }],
    status: "online",
  });

  const autoGitPull = () => {
    exec(`git pull`, (error, stdout) => {
      let response = error || stdout;
      if (!error) {
        if (!response.includes("Already up to date.")) {
          client.channels.cache
            .get(MiscConfigs.github)
            .send(
              `<t:${Date.now()
                .toString()
                .slice(
                  0,
                  -3
                )}:f> Automatic update from GitHub, pulling files.\n\`\`\`${response}\`\`\``
            );
          setTimeout(() => {
            process.exit();
          }, 1000);
        }
      }
    });
  };

  checkNicks();

  console.log(
    Chalk.magenta("[DISCORD] ") +
      Chalk.green(client.user.username + " has logged in!")
  );

  deleteOldChannels();

  //Initializing the cooldown.
  client.cooldown = {};

  //Automatic 30second git pull.
  //  setInterval(autoGitPull, 30000);

  if (Config.Enabled.nodestatsChecker == true) {
    console.log(
      Chalk.magenta("[NODE CHECKER] ") + Chalk.greenBright("Enabled")
    );

    await ServerStatus.startNodeChecker(); //Start the Node Checker.

    // Node Status Embed.
    const channel = client.channels.cache.get(MiscConfigs.nodestatus);

    setInterval(async () => {
      const embed = await ServerStatus.getEmbed();

      let messages = await channel.messages.fetch({
        limit: 10,
      });

      messages = messages.filter((x) => x.author.id === client.user.id).last();

      if (messages == null) channel.send({ embeds: [embed] });
      else messages.edit({ embeds: [embed] });
    }, 30 * 1000);
  } else {
    console.log(Chalk.magenta("[NODE CHECKER] ") + Chalk.redBright("Disabled"));
  }
};
