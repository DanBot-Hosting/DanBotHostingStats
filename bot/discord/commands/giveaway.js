const ms = require('ms')
exports.run = async (bot, message, args) => {
    if (message.member.roles.cache.find(r => r.id === "778237595477606440")) {
        message.delete()
        let channel, giveaway;
        let time = args[0];
        const prefix = `${config.DiscordBot.prefix}giveaway ${time}`;
        const a = message.content.slice(prefix.length).split(' ');
        const prize = a.join(' ')
        let actualTime = ms(time)

        try {
            if (!channel) {
                let reaction = '🎉';
                let giveawayMessage = await message.channel.send("", {
                    embed: new Discord.MessageEmbed()
                        .setTitle("GIVEAWAY! 🎉")
                        .setDescription(`Giveaway event started by <@${message.author.id}>. React to this message with ${reaction} to get a chance to win **${prize}**.`)
                        .setColor("#0000ff")
                        .setFooter(`Event stops in ${time}. You will get your reward after the event has concluded.`)
                });
                await giveawayMessage.react(reaction);

                let giveawayMessageID = giveawayMessage.id;
                channel = message.channel.id;

                let interval = await setInterval(function () {
                    time = ms(time)
                    time = time - 5000
                    time = ms(time)
                    if (time === '5s' || time === '4s' || time === '3s' || time === '2s' || time === '1s' || time === '0s') clearInterval(interval)
                    giveawayMessage.edit("🎉🎉🎉", {
                        embed: new Discord.MessageEmbed()
                            .setTitle("GIVEAWAY! 🎉")
                            .setDescription(`Giveaway event started by <@${message.author.id}>. React to this message with ${reaction} to get a chance to win **${prize}**.`)
                            .setColor("#0000ff")
                            .setFooter(`Event stops in ${time}. You will get your reward after the event has concluded.`)
                    });
                }, 5 * 1000);

                giveaway = bot.setTimeout(async () => {
                    let giveawayMessage = await message.channel.messages.fetch(giveawayMessageID);

                    let winners = [];
                    if (giveawayMessage.reactions.get(reaction)) {
                        winners = giveawayMessage.reactions.get(reaction).users.filter(user => !user.bot).map(u => u.id);
                    }

                    let winner;
                    while (!winner && winners.length) {
                        winner = winners[Math.floor(Math.random() * winners.length)];
                        winners.splice(winners.indexOf(winner), 1);
                        winner = await bot.users.fetch(winner).catch(() => {
                        });
                    }

                    if (winner) {

                        giveawayMessage.edit("", {
                            embed: new Discord.MessageEmbed()
                                .setTitle("Giveaway Event Ended")
                                .setDescription(`${winner} won the giveaway! You just won ${prize}!\nThank you everyone for participating. Better luck next time.`)
                                .setColor("#0000ff")
                        }).catch(err => {
                            console.log(err);
                        });

                        winner.send("", {
                            embed: new Discord.MessageEmbed()
                                .setTitle("Congratulations")
                                .setDescription(`You won the giveaway in **${message.guild.name}** Server! And you've been awarded with **${prize}**!`)
                                .setColor("#0000ff")
                        }).catch(() => {
                        });
                    } else {
                        giveawayMessage.edit("", {
                            embed: new Discord.MessageEmbed()
                                .setTitle("Giveaway Event Ended")
                                .setDescription(`Unfortunately, no one participated and apparently there\'s no winner. 😕`)
                                .setColor("#ff0000")
                        }).catch(e => {
                            bot.log.error(e);
                        });
                    }

                    channel = null;
                }, actualTime);
            } else {
                if (args[0] === 'end') {
                    bot.clearTimeout(giveaway);
                    channel = null;

                    message.channel.send("", {
                        embed: new Discord.MessageEmbed()
                            .setTitle("Giveaway Event Ended")
                            .setDescription(`The giveaway event was abruptly ended by ${message.author.tag}. Sorry, no giveaways this time!`)
                            .setColor("#ff0000")
                    }).catch(e => {
                        bot.log.error(e);
                    });
                } else {
                    return;
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}