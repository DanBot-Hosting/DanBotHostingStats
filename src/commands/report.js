const { Client, Message, EmbedBuilder } = require('discord.js');
const { discord } = require('../config.json');

module.exports = {
	name: 'report',
	description: 'Report a staff/user (reports are only shown to admins).',
	usage: 'report <user ID/staff ID> [reason]',
	example: 'report @Dotto bad dev',
	requiredPermissions: [],
	checks: [],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array} args
	 */
	run: async (client, message, args) => {
		const userId = args[0];
		const reason = args.slice(1).join(' ');

		if (!userId) return message.reply('Please specify a user to report.');
		if (!reason) return message.reply('Please specify a reason.');

		const user = await message.guild.members.fetch(userId).catch(() => null);
		if (!user) return message.reply('Are you sure that user ID is correct?');

		const embed = new EmbedBuilder()
			.setTitle('Report')
			.setDescription(`${user} (${user.id}) has been reported for: \n\`\`\`${reason}\`\`\``)
			.setColor('Random')
			.setAuthor({ name: `Report from: ${message.author.tag} (${message.author.id})`, iconURL: message.author.displayAvatarURL() });

		try {
			const channel = message.guild.channels.cache.get(discord.channels.report);
			if (!channel) message.reply('Could not find the report channel for this server.');

			await channel.send({ embeds: [embed] }).catch(() => null);
			return message.reply('Sent your report.');
		} catch (err) {
			console.log(err);
			return message.reply('An error occurred while sending the report.');
		}
	}
};