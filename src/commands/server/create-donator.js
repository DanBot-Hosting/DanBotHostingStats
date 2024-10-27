const Discord = require("discord.js");
const Config = require("../../../config.json");
const MiscConfigs = require("../../../config/misc-configs.js");
const { createParams, createServer } = require("../../../createData.js");
const createList = require("../../../servers.js");

exports.description = "Creates a donator server. View this command for usage.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  let userP = (await userPrem.get(message.author.id)) || {
    used: 0,
    donated: 0,
  };

  const serverName =
    message.content.split(" ").slice(3).join(" ") ||
    "Untitled Server (settings -> server name)";
  let consoleID = await userData.get(message.author.id);

  if (consoleID == null) {
    message.reply(
      "Oh no, Seems like you do not have an account linked to your discord ID.\n" +
        "If you have not made an account yet please check out `" +
        Config.DiscordBot.Prefix +
        "user new` to create an account\nIf you already have an account link it using `" +
        Config.DiscordBot.Prefix +
        "user link`"
    );
    return;
  }

  let allowed = Math.floor(userP.donated / Config.PremiumServerPrice);

  if (allowed === 0) {
    message.reply(
      "You're not a premium user, to get access to premium you can buy a server (2 servers/$1)"
    );
    return;
  }

  if (allowed - userP.used <= 0) {
    message.reply("You are at your premium server limit.");
    return;
  }

  const HelpEmbed = new Discord.EmbedBuilder();
  HelpEmbed.setColor("Red");
  HelpEmbed.addFields(
    {
      name: "Minecraft",
      value:
        "Forge: `forge`\nPaper: `paper`\nBedrock: `bedrock`\nPocketmineMP: `pocketminemp`\nWaterfall: `waterfall`\nSpigot: `spigot`",
      inline: true,
    },
    {
      name: "Grand Theft Auto",
      value:
        "alt:V: `altv`\nMultiTheftAuto: `mta`\nRage.MP: `ragemp`\nSA-MP: `samp`",
      inline: true,
    },
    {
      name: "Languages",
      value:
        "NodeJS: `nodejs`\nBun: `bun`\nPython: `python`\nJava: `java`\nAIO: `aio`\nRust: `rustc`",
      inline: true,
    },
    {
      name: "Bots",
      value: "RedBot: `redbot`",
      inline: true,
    },
    {
      name: "Source Engine",
      value: "GMod: `gmod`\nCS:GO: `csgo`\nARK:SE: `arkse`",
      inline: true,
    },
    {
      name: "Voice Servers",
      value: "TS3: `ts3`\nMumble: `mumble`",
      inline: true,
    },
    {
      name: "SteamCMD",
      value:
        "Rust: `rust`\n7 Days to Die: `daystodie`\nAssetto Corsa: `assettocorsa`\nAvorion: `avorion`\nBarotrauma: `barotrauma`",
      inline: true,
    },
    {
      name: "Databases",
      value:
        "MongoDB: `mongodb`\nRedis: `redis`\nPostgres 14: `postgres14`\nPostgres 16: `postgres16`\nMariaDB: `mariadb`\nInfluxDB: `influxdb`",
      inline: true,
    },
    {
      name: "WebHosting",
      value: "Nginx: `nginx`",
      inline: true,
    },
    {
      name: "Custom Eggs",
      value: "ShareX: `sharex`\nOpenX: `openx`",
      inline: true,
    },
    {
      name: "Software",
      value:
        "CodeServer: `codeserver`\nGitea: `gitea`\nHaste: `haste`\nUptime Kuma: `uptimekuma`\nGrafana: `grafana`",
      inline: true,
    }
  );
  HelpEmbed.setFooter({
    text:
      "Example: " +
      Config.DiscordBot.Prefix +
      "server create-donator aio My AIO Server",
    iconURL: client.user.displayAvatarURL(),
  });
  HelpEmbed.setTimestamp();

  if (!args[1]) {
    message.reply({
      embeds: [HelpEmbed],
    });
    return;
  }

  let serverType = args[1].toLowerCase();
  if (Object.keys(createList).includes(serverType)) {
    let serverConfig = createParams(serverName, consoleID.consoleID, true)[
      serverType
    ];
    createServer(serverConfig)
      .then(async (response) => {
        await userPrem.set(message.author.id + ".used", userP.used + 1);

        let embed = new Discord.EmbedBuilder().setColor(`Green`).addFields(
          {
            name: `Status`,
            value: response.statusText.toString(),
            inline: false,
          },
          {
            name: `Created for user ID`,
            value: consoleID.consoleID.toString(),
            inline: false,
          },
          {
            name: `Server name`,
            value: serverName.toString(),
            inline: false,
          },
          {
            name: `Type`,
            value: serverType,
            inline: false,
          },
          {
            name: `__**WARNING**__`,
            value: `Please do not host game servers on java or AIO servers. If you need a gameserver, You need to use Dono2. Slots are 1$ for 2 servers!`,
            inline: false,
          }
        );
        message.reply({ embeds: [embed] });

        const embed2 = new Discord.EmbedBuilder()
          .setTitle("New donator node server created!")
          .setColor("Green")
          .addFields(
            {
              name: "User:",
              value: message.author.id.toString(),
              inline: false,
            },
            {
              name: `Status`,
              value: response.statusText.toString(),
              inline: false,
            },
            {
              name: `Created for user ID`,
              value: consoleID.consoleID.toString(),
              inline: false,
            },
            {
              name: `Server name`,
              value: serverName.toString(),
              inline: false,
            },
            {
              name: `Type`,
              value: serverType,
              inline: false,
            }
          )
          .setTimestamp()
          .setFooter({
            text:
              "User has " +
              (userP.used + 1) +
              " out of a max " +
              allowed +
              " servers",
            iconURL: client.user.displayAvatarURL(),
          });

        client.channels.cache
          .get(MiscConfigs.donatorlogs)
          .send({ embeds: [embed2] });
      })
      .catch(async (error) => {
        const ErrorEmbed = new Discord.EmbedBuilder()
          .setColor("Red")
          .setTimestamp()
          .setFooter({
            text:
              "Command Executed By: " +
              message.author.username +
              ` (${message.author.id})`,
            iconURL: message.author.avatarURL(),
          });

        if (error.response && error.response.status === 400) {
          ErrorEmbed.setTitle("Error: Failed to Create a New Server");
          ErrorEmbed.setDescription(
            "The Node is currently full, Please check <#" +
              MiscConfigs.serverStatus +
              "> for updates.\n\nIf there is no updates please alert a System Administrator (<@&" +
              Config.DiscordBot.Roles.SystemAdmin +
              ">)"
          );
        } else if (error.response && error.response.status === 504) {
          ErrorEmbed.setTitle("Error: Failed to Create a New Server");
          ErrorEmbed.setDescription(
            "The Node is currently offline or having issues, You can check the status of the node in this channel: <#" +
              MiscConfigs.serverStatus +
              ">"
          );
        } else if (error.response && error.response.status === 429) {
          ErrorEmbed.setTitle("Error: Failed to Create a New Server");
          ErrorEmbed.setDescription(
            "You are being rate limited, Please wait a few minutes and try again."
          );
        } else {
          ErrorEmbed.setTitle("Error: Failed to Create a New Server");
          ErrorEmbed.setDescription(
            `Some other issue happened. If this continues please open a ticket and report this to a <@&${Config.DiscordBot.Roles.BotAdmin}> Please share this info with them: \n\n` +
              "```Error: " +
              error +
              "```"
          );
        }

        await message.reply({ embeds: [ErrorEmbed] }).catch((Error) => {});
      });
  } else {
    await message.reply({
      embeds: [HelpEmbed],
    });
  }
};
