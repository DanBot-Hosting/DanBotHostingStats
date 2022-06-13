module.exports = {
    name: "punishments",
    description: "Get the punishments of a user",
    usage: "punishments",
    example: "punishments @Wumpus#0000",
    requiredPermissions: [],
    checks: [{
        check: (message) => !message.member.roles.cache.has(config.discord.roles.staff) && args?.[0],
        error: "You do not have permission to check other users' punishments."
    }],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {}
}