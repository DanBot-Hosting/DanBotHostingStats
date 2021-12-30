exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041747597295667" | "898041741695926282")) return;

    if (!args[1]) {
        const userID = sudo.get(message.member.id);
        if (!userID) {
            message.channel.send('You are not sudoing anyone!');
        } else {
            const userInfo = await client.users.fetch(userID);
            message.channel.send(`You will no loger sudo \`${userInfo.tag}\`!`);
            sudo.delete(message.member.id);
        };

    } else {
        const userInfo = await client.users.fetch(args[1]);
        message.channel.send(`You are now sudoing \`${userInfo.tag}\`!`);
        sudo.set(message.member.id, userInfo.id);
    };
}
