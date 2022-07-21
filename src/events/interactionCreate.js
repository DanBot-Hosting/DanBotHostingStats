const { Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Suggestions = require("../utils/Schemas/Suggestions");


module.exports = {
    event: "interactionCreate",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    run: async (client, interaction) => {

        if (interaction.isButton()) {

            if (!["downvote", "upvote"].includes(interaction.customId)) return;

            const suggestion = await Suggestions.findOne({ messageId: interaction.message.id });

            if (!suggestion) {
                interaction.reply({
                    ephemeral: true,
                    content: "This suggestion does not exist."
                })
                return;
            }

            for (let i = 0; i < suggestion.voted.length; i++) {
                if (suggestion?.voted[i]?.userId === interaction.user.id) {
                    const vote = suggestion.voted[i].vote;

                    if (vote === "upvote" && interaction.customId === "downvote") {
                        suggestion.downvotes++;
                        suggestion.upvotes--;
                        suggestion.voted.splice(i, 1);
                        suggestion.voted.push({ userId: interaction.user.id, vote: "downvote" });
                    } else if (vote === "downvote" && interaction.customId === "upvote") {
                        suggestion.upvotes++;
                        suggestion.downvotes--;
                        suggestion.voted.splice(i, 1);
                        suggestion.voted.push({ userId: interaction.user.id, vote: "upvote" });
                    }

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("upvote")
                            .setLabel(`${suggestion.upvotes}`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji("⬆️")
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("downvote")
                            .setLabel(`${suggestion.downvotes}`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("⬇️")
                        )

                    await suggestion.save();

                    interaction.update({
                        components: [row]
                    })
                    return;
                }

            }

            if (interaction.customId === "upvote") {
                suggestion.upvotes++;
                suggestion.voted.push({
                    userId: interaction.user.id,
                    vote: "upvote"
                });
                await suggestion.save();
            } else if (interaction.customId === "downvote") {
                suggestion.downvotes++;
                suggestion.voted.push({
                    userId: interaction.user.id,
                    vote: "downvote"
                });

                await suggestion.save();
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("upvote")
                    .setLabel(`${suggestion.upvotes}`)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("⬆️")
                )
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("downvote")
                    .setLabel(`${suggestion.downvotes}`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("⬇️")
                )

            interaction.update({
                components: [row]
            })
        }
    },
}