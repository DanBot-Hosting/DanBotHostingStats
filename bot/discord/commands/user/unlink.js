exports.run = async (client, message, args) => {
    userData.delete(message.author.id);
    message.reply("You have unlinked this account!");
};
