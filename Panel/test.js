var node = require('nodeactyl-beta');
const Application = node.Application;
const config = require("./config.json");
const chalk = require('chalk');

Application.login(config.Pterodactyl.hosturl, config.Pterodactyl.apikey, (logged_in) => {
    console.log(chalk.magenta('[APP] ') + chalk.green("Nodeactyl logged in? " + logged_in));
});

Application.createServer("latest", "TEST", "90", null, "5", "danielpmc/discordnode8", "bash", "0", "-1", "1024", "500", "1", "0", "1").then(res => {
    console.log(res)
}).catch(error =>{
    console.log(error);
})