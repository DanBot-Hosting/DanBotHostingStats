const { Client, Interaction, MessageActionRow, MessageButton } = require("discord.js");
const Suggestions = require("../utils/Schemas/Suggestions");


module.exports = {
    event: "interactionCreate",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    run: async (client, interaction) => {

        if (interaction.isButton()) {
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

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId("upvote")
                            .setLabel(`${suggestion.upvotes}`)
                            .setStyle("SUCCESS")
                            .setEmoji("⬆️")
                        )
                        .addComponents(
                            new MessageButton()
                            .setCustomId("downvote")
                            .setLabel(`${suggestion.downvotes}`)
                            .setStyle("DANGER")
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

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId("upvote")
                    .setLabel(`${suggestion.upvotes}`)
                    .setStyle("SUCCESS")
                    .setEmoji("⬆️")
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId("downvote")
                    .setLabel(`${suggestion.downvotes}`)
                    .setStyle("DANGER")
                    .setEmoji("⬇️")
                )

            interaction.update({
                components: [row]
            })
        }
    },
}