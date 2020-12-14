const custom = require('../models/tags');
const {
	RichEmbed
} = require("discord.js")
module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD") && message.author.id != "684092617272721420") { //My ID Manon so that i can like make tags. Sick of telling the same thing over and over :P
		const embed1111111 = new RichEmbed()
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

	if (!args.slice(1).join(' ')) {
		const embed1 = new RichEmbed()
			.setColor(`#f04947`)
			.setDescription(`**❌ | You forgot to specify the respond to \`${args[0]}\`**`)
		return message.channel.send(embed1)
	}

	custom.findOne({
			Guild: message.guild.id,
			Command: args[0].toLowerCase()
		},
		async (err, data) => {
			if (err) throw err;
			if (data) {
				data.Content = args.slice(1).join(' ');
				data.save();
				const embed2 = new RichEmbed()
					.setColor(`#43b481`)
					.setDescription(`**✅ | Successfully updated the tag \`${args[0]}\`**`)
				message.channel.send(embed2)
			} else if (!data) {
				const newData = new custom({
					Guild: message.guild.id,
					Command: args[0].toLowerCase(),
					Content: args.slice(1).join(" "),
				});
				newData.save();
				const embed3 = new RichEmbed()
					.setColor(`#43b481`)
					.setDescription(`**✅ | Successfully created the tag \`${args[0]}\`**`)
				message.channel.send(embed3)
			}
		},
	);
};