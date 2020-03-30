module.exports = (client, guild, files) => {
    const timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    console.log(chalk.yellow("[" + timestamp + "] Discord bot logged in!"));
    client.user.setActivity("over DanBot Hosting", { type: "WATCHING" }); 
};