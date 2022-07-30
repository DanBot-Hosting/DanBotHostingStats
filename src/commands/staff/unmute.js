const { Client, Message, EmbedBuilder, Colors } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "unmute",
    description: "Unmutes someone",
    usage: "mute <@user> <reason>",
    example: "unmute @Wumpus#0000 appealed to the staff",
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

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ") || "unspecified";

        if (!user) return message.reply("Please mention a user to unmute.");

        message.guild.members.cache.get(user.id).timeout(null, reason).catch(err => {
            console.error(err);
            return message.reply("I was unable to unmute that user.");
        })

        const embed = new EmbedBuilder()
            .setTitle(`${user.username} has been unmuted`)
            .setDescription(`Reason: ${reason}`)
            .addFields({ name: "Moderator", value: `${message.author.tag} (${message.author.id})` })
            .setColor(Colors.Blue)
            .setTimestamp()

        const modchan = message.guild.channels.cache.get(config.discord.channels.moderationLogs);

        if (modchan) {
            modchan.send({ embeds: [embed] }).catch(err => {
                console.log(`Error sending mute to logs channel: ${err}`)
            })
        }

        message.reply(`${user.username} has been unmuted.`);
    },
}