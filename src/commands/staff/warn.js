const config = require("../../config.json");
const punishmentsSchema = require("../../utils/Schemas/Punishments");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "warn",
    description: "Warn a user",
    usage: "warn <@user> <reason>",
    example: "warn @Wumpus#0000 Causing Drama after being told to stop",
    requiredPermissions: [],
    checks: [{
        check: (message) => message.member.roles.cache.has(config.discord.roles.staff),
        error: "You do not have permission to use this command."
    }, {
        check: (message, args) => args?.[0] !== undefined,
        error: "Please mention a user or provide a valid user ID."
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args?.slice(1)?.join(" ");

        if (!user) {
            message.channel.send("Please provide a valid user.");
            return;
        }

        if (!reason) {
            message.channel.send("Please provide a reason.");
            return;
        }

        if (user.user.id === message.author.id) {
            message.channel.send("You cannot warn yourself.");
            return;
        }

        const punishments = await punishmentsSchema.findOne({ userId: user?.user?.id });

        if (!punishments) {
            await punishmentsSchema.create({
                userId: user?.user?.id,
                warnings: [{
                    moderator: message.author.id,
                    reason: reason,
                    date: new Date()
                }]
            });
        } else {
            await punishmentsSchema.updateOne({ userId: user?.user?.id }, {
                $push: {
                    warnings: {
                        moderator: message.author.id,
                        reason: reason,
                        date: new Date()
                    }
                }
            });
        }

        message.channel.send(`${user} has been warned.`);

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Warning")
            .addField("User", user?.user?.tag)
            .addField("Moderator", message.author.tag)
            .addField("Reason", reason)
            .setTimestamp();

        const modChannel = message.guild.channels.cache.get(config.discord.channels.moderationLogs);

        if (modChannel) {
            modChannel.send({
                embeds: [embed]
            });
        }

        const userEmbed = new MessageEmbed()
            .setTitle("New Warning")
            .addField("Reason", reason)
            .setColor("#ff0000")
            .setTimestamp();

        user?.user?.send({
            embeds: [userEmbed],
        }).catch(() => {
            console.log("Failed to send warning message to user.");
        })
    }
}