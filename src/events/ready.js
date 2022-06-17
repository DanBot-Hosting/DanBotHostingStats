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

        setInterval(async () => {
            await client.cache.set("users", JSON.stringify(await fetchUsers()), 600000)
        }, 600000);

        setInterval(async () => {
            const nodes = await getNodes();


            const nodeDataParsed = nodes.data.map(node => {
                return {
                    id: node.attributes.id,
                    name: node.attributes.name,
                    public: node.attributes.public,
                    fqdn: node.attributes.fqdn,
                    daemon_listen: node.attributes.daemon_listen,
                    scheme: node.attributes.scheme,
                };
            })

            const nodeStatus = {};

            for (const node of nodeDataParsed) {
                try {
                    const response = await axios({
                        method: "options",
                        url: `${node.scheme}://${node.fqdn}:${node.daemon_listen}/api/system`,
                    })

                    if (response.status === 204) {
                        nodeStatus[node.id] = {
                            ...node,
                            status: "online",
                        }
                    }
                } catch (e) {
                    if (e.code == "ECONNREFUSED") {
                        nodeStatus[node.id] = {
                            ...node,
                            status: "wings offline",
                        }
                    }
                }
            }

            for (const n in nodeStatus) {
                const node = nodeStatus[n];
                if (node.status === "wings offline") {
                    tcpPing.ping(node.fqdn, 80).catch(() => {
                        nodeStatus[n] = {
                            ...node,
                            status: "offline",
                        }
                    })
                }
            }

            const statusEmbed = new MessageEmbed()
                .setTitle("Node Status's")
                .setTimestamp()

            for (const n in nodeStatus) {
                const node = nodeStatus[n];

                const allications = await getAllocations(node.id)

                let used = 0;
                let amount = 0;

                if (allications?.data) {
                    for (const allocation of allications.data) {
                        amount++;
                        if (allocation.attributes.assigned) used++
                    }
                }

                const status = node.status === "online" ? "🟢 Online" : node.status === "wings offline" ? "🟠 Wings" : "🔴 Offline";

                statusEmbed.description = `${statusEmbed?.description ?? ""}\n**${node.name}**: ${status} (${used}/${amount})`;
            }

            const mg = await client.guilds.cache.get(config.bot.guild)?.channels?.cache?.get(config.bot.nodeStatus.channelId)?.messages?.fetch(config.bot.nodeStatus.messageId);

            if (!mg) return console.log("Failed to fetch message")

            mg.edit({
                embeds: [statusEmbed]
            });
        }, config.bot.nodeStatus.refreshInterval);

    }
}