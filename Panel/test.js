var node = require('nodeactyl-beta');
const Application = node.Application;
const config = require("./config.json");
const chalk = require('chalk');

Application.login(config.Pterodactyl.hosturl, config.Pterodactyl.apikey, (logged_in) => {
    console.log(chalk.magenta('[APP] ') + chalk.green("Nodeactyl logged in? " + logged_in));
});
setTimeout(async () => {

    Application.createServer("latest", `test`, `1`, null, "3", "quay.io/pterodactyl/core:java", "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}", "2048", "0", "25000", "500", "0", "0", "1").then(res => {
        console.log(res)
                }).catch(error =>{
                    console.log(error);
                })
}, 2000)