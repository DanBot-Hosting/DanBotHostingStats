const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const config = require("../../config.json");
const punishmentsSchema = require("../../utils/Schemas/Punishments");

module.exports = {
    name: "kick",
    description: "kick a user from the server",
    usage: "kick <@user> <reason>",
    example: "kick @Wumpus#0000 Being Annoying",
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
            message.channel.send("You cannot kick yourself.");
            return;
        }

        if (!user.kickable) {
            message.channel.send("I cannot kick this user.");
            return;
        }

        if (user.roles.cache.has(config.discord.roles.staff)) {
            message.channel.send("You cannot kick a staff member.");
            return;
        }

        if (user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
            message.channel.send("You cannot kick this user.");
            return;
        }

        const logEmbed = new EmbedBuilder()
            .setTitle(`${client.user.username} | kick`)
            .setDescription(`${user.user.toString()} (${user.user.id}) has been kicked from the server.`)
            .addFields(
                { name: "Reason", value: reason }, 
                { name: "Moderator", value: `${message.author.tag} (${message.author.id})` }
            )
            .setTimestamp()
            .setColor(Colors.DarkBlue)

        const chan = message.guild.channels.cache.get(config.discord.channels.moderationLogs);

        if (chan) {
            chan.send({ embeds: [logEmbed] });
        }

        await user.kick({ reason: reason });

        message.channel.send(`${user.user.toString()} has been kicked from the server.`);

        const punishment = await punishmentsSchema.findOne({
            userId: user.user.id,
        });

        if (!punishment) {
            await punishmentsSchema.create({
                userId: user?.user?.id,
                kicks: [{
                    moderator: message.author.id,
                    reason: reason,
                    date: new Date()
                }]
            });
        } else {
            await punishment.update({
                $push: {
                    kicks: {
                        moderator: message.author.id,
                        reason: reason,
                        date: new Date()
                    }
                }
            });
        }
    },
}