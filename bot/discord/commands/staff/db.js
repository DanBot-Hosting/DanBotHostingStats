exports.run = async (client, message, args) => {
    if(message.author.id !== "853158265466257448") return;

    try {
        nodePing.all().then(data => console.log(data));

        message.reply("Check console for data.");
    } catch(err) {
        message.reply("Error: " + err.message);
        console.log(err);
    }
}
