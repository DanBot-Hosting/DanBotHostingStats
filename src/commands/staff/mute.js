const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const ms = require("ms");
const config = require("../../config.json");
const punishmentsSchema = require("../../utils/Schemas/Punishments");


module.exports = {
    name: "mute",
    description: "Mute someone when they break a rule",
    usage: "mute <@user> <time> <reason>",
    example: "mute @Wumpus#0000 1d Spamming the chat",
    requiredPermissions: [],
    checks: [{
        check: (message) => message.member.roles.cache.has(config.discord.roles.staff),
        error: "You do not have permission to use this command."
    }, {
        check: (message, args) => args?.[0] !== undefined,
        error: "Please mention a user or provide a valid user ID."
    }, {
        check: (message, args) => args?.[1] !== undefined,
        error: "Please provide a time."
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const time = ms(args[1])
        const reason = args.slice(2).join(" ") || "unspecified";

        if (!user) return message.reply("Please mention a user to mute.");
        if (time > ms("28d")) return message.reply("You can't mute someone for more than 28 days!");
        if (time < ms("5m")) return message.reply("You can't mute someone for less than 5 minutes.");

        if (user.roles.cache.has(config.discord.roles.staff)) {
            return message.reply("You can't mute a staff member!");
        }

        if (user.user.id == message.author.id) {
            return message.reply("You can't mute yourself!");
        }

        user.timeout(time, reason).catch(err => {
            console.error(err);
            return message.reply("I was unable to mute that user.");
        })

        const embed = new EmbedBuilder()
            .setTitle(`${user.user.username} has been muted`)
            .setDescription(`Reason: ${reason}`)
            .addFields(
                { name: "Time", value: `${ms(time, { long: true })} (<t:${Math.round((Date.now() + time) / 1000)}:F>)` },
                { name: "Moderator", value: `${message.author.tag} (${message.author.id})` }
            )
            .setColor(Colors.Blue)
            .setTimestamp()

        const modchan = message.guild.channels.cache.get(config.discord.channels.moderationLogs);

        if (modchan) {
            modchan.send({ embeds: [embed] }).catch(err => {
                console.log(`Error sending mute to logs channel: ${err}`)
            })
        }

        message.reply(`${user.user.username} has been muted for ${ms(time, { long: true })} (Will Be Unmuted at <t:${Math.round((Date.now() + time) / 1000)}:F>)`);
    },
}