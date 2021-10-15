exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041748817842176" | "898041741695926282" | "898041747219828796")) return;

    if (!args[1]) {
        message.channel.send('Usage is: `DBH!staff node (number)` to restart a node if it is down')
    } else if (args[1].toLowerCase() === "unlock") {
        message.channel.send('eeeeeeeeeeee not complete eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee ')
    }
}