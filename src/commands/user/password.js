const config = require("../../config.json");
const { Client, Message } = require("discord.js");
const Pterodactyl = require('../../utils/pterodactyl/index');
const ptero = new Pterodactyl();
const UserSchema = require("../../utils/Schemas/User");

const passwordGen = (length) => {
    const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }

    return password;
}

module.exports = {
    name: "password",
    description: "reset user password",
    usage: "password",
    example: "password",
    requiredPermissions: [],
    checks: [{
        check: () => config.discord.commands.userCommandsEnabled,
        error: "The user commands are disabled!"
    }],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    run: async (client, message, args) => {
        const user = await UserSchema.findOne({ userId: message.author.id });

        if (!user) {
            message.channel.send("Please Link or Create an Account First!");
            return;
        }

        const password = passwordGen(15);

        const fetchedData = JSON.parse(await client.cache.get("users"))

        const userData = fetchedData.find(u => u.id == user.consoleId);

        await ptero.user.resetPassword(userData, password);

        message.author.send(`Your Password Has Been Reset!\n\nNew Password: ||${password}||`).catch(() => {
            return message.channel.send("Please Enable DMs to Receive Your New Password!");
        });

        message.channel.send("Your Password Has Been Reset! Please Check Your DMs!");
    },
}