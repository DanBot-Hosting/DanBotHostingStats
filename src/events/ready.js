const { Client, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("../config.json");
const fetchUsers = require("../utils/pterodactyl/user/fetch");
const getNodes = require("../utils/pterodactyl/nodes/getNodes");
const getAllocations = require("../utils/pterodactyl/nodes/getAllocations");
const axios = require("axios");
const tcpPing = require("ping-tcp-js");

module.exports = {
    event: "ready",
    /**
     * @param {Client} client 
     */
    run: async (client) => {
        console.log(chalk.green("[READY]"), `${chalk.cyan(client.user.tag)} ${chalk.blue("Is Ready!")}`);

        mongoose.connect(config.mongoDB, {}).then(() => {
            console.log(chalk.green("[READY]"), "Connected to MongoDB!");
        }).catch((err) => {
            console.log(chalk.red("[ERROR]"), `Failed to connect to MongoDB! (${err.message})`)
        })

        await client.cache.connect()
        await client.cache.set("users", JSON.stringify(await fetchUsers()), 600000)

        const guild = await client.guilds.fetch(config.bot.guild)

        await guild.members.fetch()

        for (const channel of guild.channels.cache.values()) {
            if (channel.parentId !== config.discord.categories.userCreation) continue;

            await channel.delete()
        }

        client.cacheInterval = setInterval(async () => {
            await client.cache.set("users", JSON.stringify(await fetchUsers()), 600000)
        }, 600000);
    }
}