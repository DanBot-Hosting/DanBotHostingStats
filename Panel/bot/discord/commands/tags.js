/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const tags = require("../models/tags")

exports.run = async (bot, message, args) => {
	tags.find({
			Guild: message.guild.id
		},
		async (err, data) => {
			if (err) throw err;
			if (!data) {
				return
			} else {
				const ccommands = [];
				data.forEach(c => ccommands.push(c.Command))
				const ddd = ccommands.map(m => m)
				const commands = data.map(m => `\`${m.Command}\``).join(", ");
				const embed2 = new Discord.RichEmbed()
					.setColor(`RANDOM`)
					.setTitle(`Custom tags for ${message.guild.name} - (${ddd.length})`)
					.setThumbnail(message.guild.iconURL({
						dynamic: true
					}))
					.setDescription(commands.toLocaleLowerCase() || "**There is not any tag listed for your server! \n\nUse \`tag-create\` command to create one!**")
					.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
						dynamic: true
					}))
					.setTimestamp();
				return message.channel.send(embed2)
			}
		},
	);
};