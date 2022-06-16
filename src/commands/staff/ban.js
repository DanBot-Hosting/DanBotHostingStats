const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const punishmentsSchema = require("../../utils/Schemas/Punishments");

module.exports = {
    name: "ban",
    description: "Ban a user from the server",
    usage: "ban <@user> <reason>",
    example: "ban @Wumpus#0000 Being Annoying",
    requiredPermissions: [],
    checks: [{
        check: (message) => message.member.roles.cache.has(config.discord.roles.mod),
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
            message.channel.send("You cannot ban yourself.");
            return;
        }

        if (!user.bannable) {
            message.channel.send("I cannot ban this user.");
            return;
        }

        if (user.roles.cache.has(config.discord.roles.staff)) {
            message.channel.send("You cannot ban a staff member.");
            return;
        }

        if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
            message.channel.send("You cannot ban this user.");
            return;
        }

        const logEmbed = new MessageEmbed()
            .setTitle(`${client.user.username} | Ban`)
            .setDescription(`${user.user.toString()} (${user.user.id}) has been banned from the server.`)
            .addField("Reason", reason)
            .addField("Moderator", `${message.author.tag} (${message.author.id})`)
            .setTimestamp()
            .setColor("DARK_BLUE")

        const chan = message.guild.channels.cache.get(config.discord.channels.moderationLogs);

        if (chan) {
            chan.send({ embeds: [logEmbed] });
        }

        await user.ban({ reason: reason });

        message.channel.send(`${user.user.toString()} has been banned from the server.`);

        const punishment = await punishmentsSchema.findOne({
            userId: user.user.id,
        });

        if (!punishment) {
            await punishmentsSchema.create({
                userId: user?.user?.id,
                bans: [{
                    moderator: message.author.id,
                    reason: reason,
                    date: new Date()
                }]
            });
        } else {
            await punishment.update({
                $push: {
                    bans: {
                        moderator: message.author.id,
                        reason: reason,
                        date: new Date()
                    }
                }
            });
        }
    },
}