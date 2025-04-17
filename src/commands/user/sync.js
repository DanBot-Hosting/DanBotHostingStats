const Discord = require('discord.js');
const Axios = require('axios');

const Config = require('../../../config.json');
const getUser = require('../../util/getUser.js');

exports.description = "Sync your Discord account with your panel account (updates email and username).";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    // Check if user has a linked account
    const userAccount = await userData.get(message.author.id);
    
    if (!userAccount) {
        return message.reply(
            `You do not have a panel account linked, please create or link an account.\n\`${Config.DiscordBot.Prefix}user new\` - Create an account\n\`${Config.DiscordBot.Prefix}user link\` - Link an account`
        );
    }

    const syncEmbed = new Discord.EmbedBuilder()
        .setTitle('Account Sync')
        .setColor('Blue')
        .setDescription('Syncing your account information with the panel...')
        .setTimestamp();

    const syncMessage = await message.reply({ embeds: [syncEmbed] });

    try {
        // Get current panel data for the user
        const panelResponse = await Axios({
            url: `${Config.Pterodactyl.hosturl}/api/application/users/${userAccount.consoleID}`,
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                'Content-Type': 'application/json',
                Accept: 'Application/vnd.pterodactyl.v1+json',
            },
        });

        const panelUser = panelResponse.data.attributes;
        let changes = [];

        // Check if email has changed:
        if (panelUser.email !== userAccount.email) {
            await userData.set(`${message.author.id}.email`, panelUser.email);
            changes.push(`Email updated from \`${userAccount.email}\` to \`${panelUser.email}\``);
        }

        // Check if username has changed
        if (panelUser.username !== userAccount.username) {
            await userData.set(`${message.author.id}.username`, panelUser.username);
            changes.push(`Username updated from \`${userAccount.username}\` to \`${panelUser.username}\``);
        }

        // Update the embed based on changes:
        if (changes.length > 0) {
            syncEmbed
                .setDescription('Your account has been successfully synced with the panel!')
                .addFields({ name: 'Changes Made', value: changes.join('\n') });
        } else {
            syncEmbed
                .setDescription('Your account is already in sync with the panel. No changes were needed.');
        }

        await syncMessage.edit({ embeds: [syncEmbed] });

    } catch (error) {
        console.error('[USER SYNC] Error:', error);
        
        syncEmbed
            .setColor('Red')
            .setDescription('An error occurred while syncing your account. Please try again later.');
        
        await syncMessage.edit({ embeds: [syncEmbed] });
    }
};