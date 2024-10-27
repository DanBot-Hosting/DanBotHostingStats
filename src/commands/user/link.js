const Discord = require("discord.js");

const Config = require("../../../config.json");
const MiscConfigs = require("../../../config/misc-configs.js");

const getUser = require("../../util/getUser.js");
const generateCode = require("../../util/generateCode.js");
const sendEmail = require("../../util/sendEmail.js");

exports.description = "Link your console account to your Discord account.";

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array} args
 */
exports.run = async (client, message, args) => {
  if ((await userData.get(message.author.id)) != null) {
    const AlreadyLinkedEmbed = new Discord.EmbedBuilder()
      .setColor(`Green`)
      .addFields(
        {
          name: `**__Username__**`,
          value: await userData.get(message.author.id + ".username"),
        },
        {
          name: `**__Linked Date (YYYY-MM-DD)__**`,
          value: await userData.get(message.author.id + ".linkDate"),
        },
        {
          name: `**__Linked Time__**`,
          value: await userData.get(message.author.id + ".linkTime"),
        }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconUrl: client.user.avatarURL(),
      });

    message.reply({
      content: "This account is linked!",
      embeds: [AlreadyLinkedEmbed],
    });
  } else {
    const server = message.guild;

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
      reason: "User linking their account.",
    });

    message.reply(`Please check <#${channel.id}> to link your account.`);

    const category = server.channels.cache.find(
      (c) =>
        c.id === MiscConfigs.accounts &&
        c.type === Discord.ChannelType.GuildCategory
    );

    if (!category) throw new Error("Category channel does not exist");

    await channel.setParent(category, { lockPermissions: false });

    const InitialEmbed = new Discord.EmbedBuilder()
      .setColor("Blue")
      .setTitle("Please enter your account email address:")
      .setDescription(
        "You have 2 minutes to respond.\n\nThis will take a few seconds to find your account."
      )
      .setFooter({
        text: "You can type 'cancel' to cancel the request.",
        iconURL: client.user.avatarURL(),
      });

    const msg = await channel.send({
      content: message.author.toString(),
      embeds: [InitialEmbed],
    });

    const EmailCollector = new Discord.MessageCollector(msg.channel, {
      max: 1,
      time: 2 * 60 * 1000,
      idle: 2 * 60 * 1000,
      filter: (m) => m.author.id === message.author.id,
    });

    EmailCollector.on("collect", async (MessageCollected) => {
      await MessageCollected.delete();

      if (MessageCollected.content.toLocaleLowerCase() === "cancel") {
        await cancelRequest(
          msg,
          channel,
          "Request to link your account canceled."
        );
        await EmailCollector.stop();
      } else {
        await EmailCollector.stop();
      }
    });

    EmailCollector.once("end", async (MessageCollected, Reason) => {
      if (
        MessageCollected.size > 0 &&
        MessageCollected.first().content.toLocaleLowerCase() === "cancel"
      )
        return;

      if (MessageCollected.size === 0) {
        await cancelRequest(
          msg,
          channel,
          "You did not provide an email address in time."
        );
      } else {
        const Email = MessageCollected.first().content;
        await EmailVerification(Email);
      }
    });

    async function EmailVerification(Email) {
      let Users = null;

      try {
        Users = await getUser(Email);
      } catch (Error) {
        // Do Nothing.
      }

      if (Users == null) {
        await cancelRequest(
          msg,
          channel,
          "An error occurred while fetching your account."
        );
        return;
      }

      const User = Users.data.find((usr) =>
        usr.attributes ? usr.attributes.email === Email : false
      );

      const Code = generateCode(10);

      if (!User) {
        message.guild.channels.cache
          .get(MiscConfigs.accountLinked)
          .send(
            `User ${message.author.username} (${message.author.id}) tried to link their account but the email was not found in the database.`
          );
      } else {
        await sendEmail(
          Email,
          "DanBot Hosting - Account Linking Verification",
          `Hello, ${message.author.username} (ID: ${message.author.id}) just tried to link their Discord account with this console email address. Here is a verification code that is needed to link: ${Code}`
        ).catch((Error) => {
          console.error("[ACCOUNT LINKING] Email could not be sent.");
        });
      }

      const VerificationEmbed = new Discord.EmbedBuilder()
        .setColor("Blurple")
        .setDescription(
          "If an account exists, a code was sent to your email address. You have 10 minutes to provide a code."
        )
        .setFooter({
          text: "You can type 'cancel' to cancel the request.",
          iconURL: await client.user.avatarURL({ extension: "png" }),
        })
        .setTimestamp();

      await msg.edit({
        content: msg.content.toString(),
        embeds: [VerificationEmbed],
      });

      const VerificationCollector = new Discord.MessageCollector(msg.channel, {
        max: 1,
        time: 10 * 60 * 1000,
        idle: 10 * 60 * 1000,
        filter: (m) => m.author.id === message.author.id,
      });

      VerificationCollector.on("collect", async (MessageCollected) => {
        await MessageCollected.delete();

        if (MessageCollected.content.toLocaleLowerCase() === "cancel") {
          await cancelRequest(
            msg,
            channel,
            "Request to link your account canceled."
          );
          await VerificationCollector.stop();
        } else {
          VerificationCollector.stop();
        }
      });

      VerificationCollector.once("end", async (MessageCollected, Reason) => {
        if (
          MessageCollected.size > 0 &&
          MessageCollected.first().content.toLocaleLowerCase() === "cancel"
        )
          return;

        if (MessageCollected.size === 0) {
          await cancelRequest(
            msg,
            channel,
            "You did not provide a verification code in time."
          );
        } else {
          const ResponseCode = MessageCollected.first().content;

          if (Code === ResponseCode) {
            await linkAccount(msg, channel, User, message.author);
          } else {
            await cancelRequest(
              msg,
              channel,
              "The code you provided is incorrect. Account linking cancelled."
            );
          }
        }
      });
    }
  }
};

async function cancelRequest(msg, channel, description) {
  const CancelEmbed = new Discord.EmbedBuilder()
    .setColor("Red")
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: "This channel will be deleted in 10 seconds.",
    });

  await msg.edit({
    content: description,
    embeds: [CancelEmbed],
  });

  setTimeout(async () => {
    await channel.delete(description);
  }, 10 * 1000);
}

async function linkAccount(msg, channel, User, author) {
  const timestamp = `${moment().format("HH:mm:ss")}`;
  const datestamp = `${moment().format("DD-MM-YYYY")}`;

  await userData.set(`${author.id}`, {
    discordID: author.id,
    consoleID: User.attributes.id,
    email: User.attributes.email,
    username: User.attributes.username,
    linkTime: timestamp,
    linkDate: datestamp,
    domains: [],
    epochTime: Date.now() / 1000,
  });

  const StaffLogs = new Discord.EmbedBuilder()
    .setColor("Green")
    .setTitle("Account Linked:")
    .addFields(
      {
        name: "**Linked Discord Account:**",
        value: `${author.toString()} - (${author.id})`,
        inline: false,
      },
      {
        name: `**Linked Console account email:**`,
        value: "`" + User.attributes.email + "`",
        inline: false,
      },
      {
        name: `**Linked At: (TIME / DATE)**`,
        value: `${timestamp} / ${datestamp}`,
        inline: false,
      },
      {
        name: `**Linked Console ID:**`,
        value: `${User.attributes.id}`,
        inline: false,
      },
      {
        name: `**Linked Time [BETA]**`,
        value: `<t:${Math.floor(Date.now() / 1000)}:F> (<t:${Math.floor(
          Date.now() / 1000
        )}:R>)`,
        inline: false,
      }
    );

  const FinalEmbed = new Discord.EmbedBuilder()
    .setColor("Green")
    .setDescription("**Account linked! Channel deleting in 10 seconds.**")
    .setTimestamp()
    .setFooter({
      text: client.user.username,
      iconURL: await client.user.avatarURL({ extension: "png" }),
    });

  await msg.edit({ embeds: [FinalEmbed] }).then(async () => {
    await client.channels.cache.get(MiscConfigs.accountLinked).send({
      content: `<@${author.id}> linked their account. Here's some info: `,
      embeds: [StaffLogs],
    });

    setTimeout(async () => {
      await channel.delete();
    }, 10 * 1000);
  });
}
