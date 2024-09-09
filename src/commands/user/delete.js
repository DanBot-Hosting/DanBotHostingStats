const Discord = require('discord.js');
const Axios = require("axios");
const Config = require('../../../config.json');

const deleteServer = require('../../util/deleteServer.js');

// In-memory storage for pending deletions
const pendingDeletions = new Map(); // userId -> { deletionTime, reminderSent }

// Time constants
const ONE_DAY = 24 * 60 * 60 * 1000;
const REMINDER_TIME = 23 * ONE_DAY; // 7 days before the 30-day deletion

exports.description = "Delete your panel account and your account data on the bot.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    const UserAccount = userData.get(message.author.id);

    if (!UserAccount) {
        message.reply("You don't have a linked `panel account` to delete.");
        return;
    }

    const ConfirmEmbed = new Discord.EmbedBuilder()
        .setTitle("Delete Panel Account")
        .setColor("Red")
        .setDescription("Are you sure you want to delete your account? This action is **irreversible** and will delete all associated servers.\n\n**Also note that you may have other data associated with your account that will not be deleted with this command. Please open a ticket if you'd like a full data deletion.**")
        .setFooter({ text: "Please confirm within 30 seconds.", iconURL: client.user.avatarURL()})
        .setTimestamp();

    const Row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId('confirmDelete')
            .setLabel('Confirm Deletion')
            .setStyle(Discord.ButtonStyle.Danger),
        new Discord.ButtonBuilder()
            .setCustomId('cancelDelete')
            .setLabel('Cancel')
            .setStyle(Discord.ButtonStyle.Secondary)
    );

    const MessageReply = await message.reply({ embeds: [ConfirmEmbed], components: [Row] });

    const Collector = await MessageReply.createMessageComponentCollector({
        time: 30 * 1000,
        filter: (Interaction) => Interaction.user.id === message.author.id
    });

    Collector.on('collect', async (Interaction) => {
        if (Interaction.customId === 'confirmDelete') {
            await Interaction.update({ content: "Deletion request confirmed. You will receive a reminder one week before the account is deleted.", components: [] });

            const deletionTime = Date.now() + 30 * ONE_DAY;
            pendingDeletions.set(message.author.id, { deletionTime, reminderSent: false });

            // Set up reminder check
            setTimeout(async () => {
                if (pendingDeletions.has(message.author.id)) {
                    const user = await client.users.fetch(message.author.id);
                    if (user) {
                        user.send("Reminder: Your panel account will be deleted in one week. If you wish to keep your account, please contact the staff.");
                    }
                    pendingDeletions.set(message.author.id, { ...pendingDeletions.get(message.author.id), reminderSent: true });
                }
            }, REMINDER_TIME);

            // Set up final deletion
            setTimeout(async () => {
                if (pendingDeletions.has(message.author.id)) {
                    const UserAccount = userData.get(message.author.id);
                    if (UserAccount) {
                        try {
                            const response = await Axios({
                                url: `${Config.Pterodactyl.hosturl}/api/application/users/${UserAccount.consoleID}?include=servers`,
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                                    "Content-Type": "application/json",
                                    Accept: "Application/vnd.pterodactyl.v1+json"
                                },
                            });

                            await Promise.all(
                                response.data.attributes.relationships.servers.data.map((Server, index) => {
                                    return new Promise((resolve) => {
                                        setTimeout(async () => {
                                            try {
                                                await Axios(deleteServer(`/api/application/servers/${Server.attributes.id}/force`));
                                                resolve();
                                            } catch (Error) {
                                                console.log(Error);
                                                resolve();
                                            }
                                        }, 500 * (index + 1));
                                    });
                                })
                            );

                            await Axios({
                                url: `${Config.Pterodactyl.hosturl}/api/application/users/${UserAccount.consoleID}`,
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                                    "Content-Type": "application/json",
                                    Accept: "Application/vnd.pterodactyl.v1+json"
                                },
                            });

                            userData.delete(message.author.id);

                            const user = await client.users.fetch(message.author.id);
                            if (user) {
                                user.send("Your panel account and all associated servers have been successfully deleted.");
                            }
                        } catch (err) {
                            console.log(err);
                            const user = await client.users.fetch(message.author.id);
                            if (user) {
                                user.send("An error occurred while deleting your account. Please contact support.");
                            }
                        }
                        pendingDeletions.delete(message.author.id);
                    }
                }
            }, 30 * ONE_DAY);
        } else if (Interaction.customId === 'cancelDelete') {
            await Interaction.update({ content: "Account deletion cancelled.", components: [] });
        }
    });

    Collector.on('end', (collected, reason) => {
        if (reason === 'time') {
            MessageReply.edit({ content: "No response. Account deletion cancelled.", components: [] });
        }
    });
};

// Periodic check to handle deletions and reminders
setInterval(async () => {
    const now = Date.now();
    for (const [userId, { deletionTime, reminderSent }] of pendingDeletions.entries()) {
        if (!reminderSent && now >= deletionTime - REMINDER_TIME) {
            const user = await client.users.fetch(userId);
            if (user) {
                user.send("Reminder: Your panel account will be deleted in one week. If you wish to keep your account, please contact the staff.");
            }
            pendingDeletions.set(userId, { deletionTime, reminderSent: true });
        }

        if (now >= deletionTime) {
            const UserAccount = userData.get(userId);
            if (UserAccount) {
                try {
                    const response = await Axios({
                        url: `${Config.Pterodactyl.hosturl}/api/application/users/${UserAccount.consoleID}?include=servers`,
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                            "Content-Type": "application/json",
                            Accept: "Application/vnd.pterodactyl.v1+json"
                        },
                    });

                    await Promise.all(
                        response.data.attributes.relationships.servers.data.map((Server, index) => {
                            return new Promise((resolve) => {
                                setTimeout(async () => {
                                    try {
                                        await Axios(deleteServer(`/api/application/servers/${Server.attributes.id}/force`));
                                        resolve();
                                    } catch (Error) {
                                        console.log(Error);
                                        resolve();
                                    }
                                }, 500 * (index + 1));
                            });
                        })
                    );

                    await Axios({
                        url: `${Config.Pterodactyl.hosturl}/api/application/users/${UserAccount.consoleID}`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                            "Content-Type": "application/json",
                            Accept: "Application/vnd.pterodactyl.v1+json"
                        },
                    });

                    userData.delete(userId);

                    const user = await client.users.fetch(userId);
                    if (user) {
                        user.send("Your panel account and all associated servers have been successfully deleted.");
                    }
                } catch (err) {
                    console.log(err);
                    const user = await client.users.fetch(userId);
                    if (user) {
                        user.send("An error occurred while deleting your account. Please contact support.");
                    }
                }
                pendingDeletions.delete(userId);
            }
        }
    }
}, ONE_DAY);
