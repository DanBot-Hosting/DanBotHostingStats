const Discord = require("discord.js");
const axios = require("axios");
const validator = require("validator");

const Config = require("../../../config.json");
const MiscConfigs = require("../../../config/misc-configs.js");

const generatePassword = require("../../util/generatePassword.js");
const generateCode = require("../../util/generateCode.js");
const sendMail = require("../../util/sendEmail.js");

exports.description = "Create a new panel account.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 * @returns void
 */
exports.run = async (client, message, args) => {
  const userAccount = await userData.get(message.author.id);

  if (userAccount != null) {
    message.reply(
      "You already have a `panel account` linked to your discord account."
    );
    return;
  }

  let questions = [
    {
      id: "tos",
      question:
        "https://danbot.host/tos\nPlease read our Terms of Service, do you accept? (**yes or no**)",
      filter: (m) => m.author.id === message.author.id,
      afterChecks: [
        {
          check: (msg) => msg.toLowerCase() == "yes",
          errorMessage: "You must accept our Terms of Service!",
        },
      ],
      time: 1000 * 60 * 10,
      value: null,
    },
    {
      id: "username",
      question:
        "What should your username be? (**Please don't use spaces or special characters**)",
      filter: (m) => m.author.id === message.author.id,
      afterChecks: [
        {
          check: (msg) => msg.trim().split(" ").length == 1,
          errorMessage: "Username must not contain any spaces.",
        },
      ],
      time: 30000,
      value: null,
    },
    {
      id: "email",
      question: "What's your email? *(must be a valid email)*",
      filter: (m) => m.author.id === message.author.id,
      afterChecks: [
        {
          check: (msg) => validator.isEmail(msg.toLowerCase().trim()),
          errorMessage: "The email must be valid.",
        },
      ],
      time: 30000,
      value: null,
    },
  ];

  server = message.guild;

  const category = server.channels.cache.find(
    (c) =>
      c.id === MiscConfigs.accounts &&
      c.type === Discord.ChannelType.GuildCategory
  );

  if (!category) throw new Error("Category channel does not exist.");

  const channel = await server.channels.create({
    name: message.author.username,
    type: Discord.ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: message.author.id,
        allow: [
          Discord.PermissionFlagsBits.ViewChannel,
          Discord.PermissionFlagsBits.SendMessages,
          Discord.PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: server.id,
        deny: [Discord.PermissionFlagsBits.ViewChannel],
      },
    ],
    reason: "User creating their account.",
  });

  await channel.setParent(category, { lockPermissions: false });

  message.reply(`Please check <#${channel.id}> to create an account.`);

  let msg = null;

  const sendOrUpdateMessage = async (content, embed) => {
    if (msg == null) {
      msg = await channel.send({ content, embeds: [embed] });
    } else {
      await msg.edit({ content, embeds: [embed] });
    }
  };

  for (const question of questions) {
    const embed = new Discord.EmbedBuilder()
      .setColor("Green")
      .setDescription(question.question)
      .setFooter({
        text: "You can type 'cancel' to cancel the request.",
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp();

    await sendOrUpdateMessage(message.member.toString(), embed);

    let collectedMessages;
    try {
      collectedMessages = await channel.awaitMessages({
        filter: question.filter,
        max: 1,
        time: question.time,
        errors: ["time"],
      });
    } catch (error) {
      channel.send(
        "User failed to provide an input!\nAccount creation cancelled!"
      );
      setTimeout(() => {
        channel.delete();
      }, 5000);
      return;
    }

    question.value = collectedMessages.first().content.trim();
    await collectedMessages.first().delete();

    if (question.value.toLowerCase() === "cancel") {
      msg.delete();
      channel.send("Cancelled!");
      setTimeout(() => {
        channel.delete();
      }, 5000);
      return;
    }

    for (const afterCheck of question.afterChecks) {
      if (!afterCheck.check(question.value)) {
        channel.send(afterCheck.errorMessage);
        channel.send("Account creation cancelled!");
        setTimeout(() => {
          channel.delete();
        }, 5000);
        return;
      }
    }

    if (question.id === "email") {
      const verificationCode = generateCode().toString();
      await sendMail(
        question.value,
        "Your Verification Code",
        `<p>Your verification code is: <b>${verificationCode}</b></p>`
      ).catch((Error) => {
        console.error("[USER CREATION] Email could not be sent.");
      });

      questions.push({
        id: "verification",
        question:
          "Please enter the 10-digit verification code sent to your email:",
        filter: (m) => m.author.id === message.author.id,
        afterChecks: [
          {
            check: (msg) => msg === verificationCode,
            errorMessage:
              "Invalid verification code. Account creation cancelled.",
          },
        ],
        time: 1000 * 60 * 10,
        value: null,
      });
    }
  }

  const embed = new Discord.EmbedBuilder()
    .setDescription(
      "Attempting to create an account for you...\n\n>>> " +
        questions
          .map(
            (question) => `**${question.id}:** ${question.value.toLowerCase()}`
          )
          .join("\n")
    )
    .setFooter(null)
    .setTimestamp();

  await sendOrUpdateMessage(message.member.toString(), embed);

  const data = {
    username: questions
      .find((question) => question.id == "username")
      .value.toLowerCase(),
    email: questions
      .find((question) => question.id == "email")
      .value.toLowerCase(),
    first_name: questions.find((question) => question.id == "username").value,
    last_name: ".",
    password: generatePassword(),
    root_admin: false,
    language: "en",
  };

  axios({
    url: Config.Pterodactyl.hosturl + "/api/application/users",
    method: "POST",
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      Authorization: "Bearer " + Config.Pterodactyl.apikey,
      "Content-Type": "application/json",
      Accept: "Application/vnd.pterodactyl.v1+json",
    },
    data: data,
  })
    .then(async (user) => {
      await userData.set(`${message.author.id}`, {
        discordID: message.author.id,
        consoleID: user.data.attributes.id,
        email: user.data.attributes.email,
        username: user.data.attributes.username,
        linkTime: moment().format("HH:mm:ss"),
        linkDate: moment().format("YYYY-MM-DD"),
        domains: [],
      });

      const embed = new Discord.EmbedBuilder()
        .setTitle("Account Created! Account Information:")
        .setColor("Green")
        .setDescription(
          "Panel URL: " +
            Config.Pterodactyl.hosturl +
            "\nUsername: `" +
            data.username +
            "\n`Email: `" +
            data.email +
            "\n`Password: `" +
            data.password +
            "`"
        )
        .setFooter({
          text: "Please note: It is recommended that you change the password.",
          iconURL: client.user.avatarURL(),
        })
        .setTimestamp();

      await sendOrUpdateMessage(message.member.toString(), embed);

      channel.send(
        "**You have 30 minutes to keep note of this info before the channel is deleted.**"
      );
      message.guild.members.cache
        .get(message.author.id)
        .roles.add(Config.DiscordBot.Roles.Client);

      setTimeout(() => {
        channel.delete();
      }, 1800000);
    })
    .catch((err) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        const embed = new Discord.EmbedBuilder()
          .setColor("Red")
          .setTitle("An error has occurred:")
          .setDescription(
            "**ERRORS:**\n\n- " +
              errors
                .map((error) => error.detail.replace("\n", " "))
                .join("\n- ")
          )
          .setTimestamp()
          .setFooter({
            text: "Deleting in 30 seconds...",
          });

        sendOrUpdateMessage("", embed);
        setTimeout(() => {
          channel.delete();
        }, 30000);
      } else {
        channel.send(
          "An unexpected error has occurred, please try again later..."
        );
        setTimeout(() => {
          channel.delete();
        }, 30000);
      }
    });
};
