const exec = require("child_process").exec;
const cap = require("../../util/cap");

exports.run = async (client, message, args) => {
    //Checks if the user has the Bot System Administrator Role or is William
    if (!message.member.roles.cache.find((r) => r.id === "898041743566594049") && message.author.id !== "853158265466257448") return;

    exec(`git pull`, (error, stdout) => {
        let response = error || stdout;
        if (!error) {
            if (response.includes("Already up to date.")) {
                message.reply("All files are already up to date.");
            } else {
                client.channels.cache
                    .get("898041843902742548")
                    .send(`**Update requested by <@${message.author.id}>, pulling files.**\n\`\`\`${cap(response, 1900)}\`\`\``);

                message.reply("Pulling files from GitHub.");
                setTimeout(() => {
                    process.exit();
                }, 1000);
            }
        }
    });
};
