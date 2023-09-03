exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "898041743566594049")) return;

    if (!args[1]) {
        const userID = sudo.get(message.member.id);
        if (!userID) {
            message.reply("You are not sudoing anyone!");
        } else {
            const userInfo = await client.users.fetch(userID);
            message.reply(`You will no longer sudo \`${userInfo.tag}\`!`);
            sudo.delete(message.member.id);
        }
    } else {
        const userInfo = await client.users.fetch(args[1]);
        message.reply(`You are now sudoing \`${userInfo.tag}\`!`);
        sudo.set(message.member.id, userInfo.id);
    }
};
