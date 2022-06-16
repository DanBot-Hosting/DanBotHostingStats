const config = require("../config.json");
const punishmentsSchema = require("../utils/Schemas/Punishments");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "punishments",
    description: "Get the punishments of a user",
    usage: "punishments",
    example: "punishments @Wumpus#0000",
    requiredPermissions: [],
    checks: [],
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        // Finish Later
    }
}