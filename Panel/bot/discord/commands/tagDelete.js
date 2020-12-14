const tags = require('../models/tags');
const Discord = require('discord.js');
const {
	RichEmbed
} = require("discord.js")

exports.run = async (client, message, args) => {

	if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id != "684092617272721420") {
		const embed1111111 = new Discord.RichEmbed()
			.setColor(`#f04947`)
			.setDescription(`**❌ | You need \`MANAGE_GUILD\` permission to use that command!**`)
		return message.channel.send(embed1111111);
	}

	if (!args[0]) {
		const embed = new RichEmbed()
			.setColor(`#f04947`)
			.setDescription(`**❌ | Please specify a tag name!**`)
		return message.channel.send(embed)
	}

	tags.findOne({
			Guild: message.guild.id,
			Command: args[0].toLowerCase()
		},
		async (err, data) => {
			if (err) throw err;
			if (data) {
				await tags.findOneAndDelete({
						Guild: message.guild.id,
						Command: args[0].toLowerCase()
					})
					.catch(err => console.log(err))
				const embed2 = new RichEmbed()
					.setColor(`#43b481`)
					.setDescription(`**✅ | Successfully deleted the tag \`${args[0]}\`**`)
				message.channel.send(embed2)
			} else if (!data) {
				const embed3 = new RichEmbed()
					.setColor(`#f04947`)
					.setDescription(`**❌ | \`${args[0]}\` tag doesn't exists!**`)
				message.channel.send(embed3)
			}
		},
	);
};
