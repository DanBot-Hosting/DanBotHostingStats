exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "697599153538334841" | "639489438036000769" | "639481606112804875")) return;

    if (!args[1]) {
        message.channel.send('Usage is: `DBH!staff node (number)` to restart a node if it is down')
    } else if (args[1].toLowerCase() === "unlock") {
        message.channel.send('eeeeeeeeeeee not complete eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee ')
    }
}