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
    }
}