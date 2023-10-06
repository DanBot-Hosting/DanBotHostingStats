exports.run = async (client, message, args) => {
    if(message.author.id !== "853158265466257448") return;

    try {
        const db = require("quick.db");
        db.all().forEach((x) => {
            console.log(x.ID + " | " + x.data);
        });
        message.reply("Check console for data.");
    } catch(err) {
        message.reply("Error: " + err.message);
        console.log(err);
    }
}
