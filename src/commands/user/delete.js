const Discord = require('discord.js');
const Axios = require("axios");

const deleteServer = require('../../util/deleteServer.js');

const Config = require('../../../config.json');

exports.description = "Delete your panel account and your account data on the bot.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {

    // Check if the user has a linked panel account
    const UserAccount = await userData.get(message.author.id);

    if (!UserAccount) {
        message.reply("You don't have a linked `panel account` to delete.");
        return;
    }

    // Create the initial confirmation embed
    const ConfirmEmbed = new Discord.EmbedBuilder()
        .setTitle("Delete Panel Account")
        .setColor("Red")
        .setDescription("Are you sure you want to delete your account? This action is **irreversible** and will delete all associated servers.\n\n**Also note that you may have other data associated with your account that will not be deleted with this command. Please open a ticket if you'd like a full data deletion.**")
        .setFooter({ text: "Please confirm within 30 seconds.", iconURL: client.user.avatarURL()})
        .setTimestamp();

    // Create the button for confirmation
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

    // Send the confirmation message with buttons.
    const MessageReply = await message.reply({ embeds: [ConfirmEmbed], components: [Row] });

    // Create a collector for the buttons.
    const Collector = await MessageReply.createMessageComponentCollector({
        time: 30 * 1000,
        filter: (Interaction) => Interaction.user.id === message.author.id
    });

    Collector.on('collect', async (Interaction) => {
        if (Interaction.customId === 'confirmDelete') {
            await Interaction.update({ content: "Deleting your panel account...", components: [] });

            try {
                await Axios({
                    url: `${Config.Pterodactyl.hosturl}/api/application/users/${UserAccount.consoleID}?include=servers`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                        "Content-Type": "application/json",
                        Accept: "Application/vnd.pterodactyl.v1+json"
                    },
                }).then(async (Response) => {

                    // Delete all servers associated with the account.
                    await Promise.all(
                        Response.data.attributes.relationships.servers.data.map((Server, index) => {
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

                    // Delete the account.
                    await Axios({
                        url: `${Config.Pterodactyl.hosturl}/api/application/users/${UserAccount.consoleID}`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                            "Content-Type": "application/json",
                            Accept: "Application/vnd.pterodactyl.v1+json"
                        },
                    })
                });

                // Delete the user's premium if they have one.
                await userData.delete(message.author.id);

                await Interaction.followUp({
                    content: "Your panel account and all associated servers have been successfully deleted.",
                    ephemeral: true
                });

                MessageReply.edit({ content: "Your panel account and all associated servers have been successfully deleted.", embeds: [], components: [] });

                Collector.stop('completed');

            } catch (err) {
                console.log(err);

                await Interaction.followUp({
                    content: "An error occurred while deleting your account. Please try again later.",
                    ephemeral: true
                });

                Collector.stop('errored');
            }

        } else if (Interaction.customId === 'cancelDelete') {
            await Interaction.update({ content: "Account deletion cancelled.", components: [], embeds: [] });

            Collector.stop('cancelled');
        }
    });

    Collector.on('end', (collected, reason) => {
        if (reason === 'time') {
            MessageReply.edit({ content: "No response. Account deletion cancelled.", components: [], embeds: [] });
        }
    });
};
