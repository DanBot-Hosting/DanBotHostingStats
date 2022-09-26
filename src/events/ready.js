const { Client, EmbedBuilder, Colors } = require("discord.js");
const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("../config.json");
const axios = require("axios");
const tcpPing = require("ping-tcp-js");
const Pterodactyl = require('../utils/pterodactyl/index');
const ptero = new Pterodactyl();

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
        await client.cache.set("users", JSON.stringify(await ptero.user.fetchUsers()), 600000)

        const guild = await client.guilds.fetch(config.bot.guild)

        await guild.members.fetch()

        for (const channel of guild.channels.cache.values()) {
            if (channel.parentId !== config.discord.categories.userCreation) continue;

            await channel.delete()
        }

        setInterval(async () => {
            await client.cache.set("users", JSON.stringify(await ptero.nodes.fetchUsers()), 600000)
        }, 600000);

        const statusMessage = await client.guilds.cache.get(config.bot.guild)?.channels?.cache?.get(config.bot.nodeStatus.channelId)?.messages?.fetch(config.bot.nodeStatus.messageId);

        setInterval(async () => {
            if (!statusMessage) return console.log(chalk.red("[ERROR]"), "Failed to fetch status message!");

            const nodes = await ptero.nodes.getNodes();

            const nodeDataParsed = nodes.data.data.map(node => {
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

            const statusEmbed = {
                title: "Node Status",
                description: '',
                timestamp: new Date(),
                color: Colors.Orange
            }

            for (const n in nodeStatus) {
                const node = nodeStatus[n];

                const amount = ((await ptero.nodes.getAllocations(node.id))?.data?.data?.length) ?? "N/A";
                const used = ((await ptero.nodes.getServers(node.id))?.data?.attributes?.relationships?.servers?.data?.length) ?? "N/A";

                const status = node.status === "online" ? "🟢 Online" : node.status === "wings offline" ? "🟠 Wings" : "🔴 Offline";

                statusEmbed.description = `${statusEmbed?.description ?? ""}\n**${node.name}**: ${status} (${used}/${amount})`;
            }

            statusMessage.edit({
                embeds: [statusEmbed]
            });

        }, config.bot.nodeStatus.refreshInterval);

    }
}