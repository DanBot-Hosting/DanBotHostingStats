const Router = require("express").Router();
const db = require("quick.db");
const axios = require('axios')
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", (req, res) => {
    res.send('Oh, Hello there *waves* <meta http-equiv="refresh" content="0; URL=https://youtu.be/dQw4w9WgXcQ" />')
});

Router.get("/fetch", (req, res) => {
    if (req.headers.password == config.externalPassword) {

    }
})

 Router.get("/fetch", (req, res) => {
     if (req.headers.password == config.externalPassword) {
         if (!req.query.user) {
             res.send('Missing data.')
         } else {
             const fetchUserData = userData.get(req.query.user);
             if (fetchUserData == null) {
                 const data = {
                     error: "No account found for that user!"
                 }
                 res.json(data)
             } else {
                 const data = {
                     username: fetchUserData.username,
                     email: fetchUserData.email,
                     discordID: fetchUserData.discordID,
                     consoleID: fetchUserData.consoleID,
                     linkTime: fetchUserData.linkTime,
                     linkDate: fetchUserData.linkDate
                 }
                 res.json(data)
             }
         }
     } else {
         res.send('Invalid Password!')
         console.log(chalk.red('[WARNING] ' + req.headers["x-forwarded-for" || "cf-connecting-ip"] + " tried to access https://danbot.host/external/fetch"))
    }
});

Router.post("/premium", (req, res) => {
    if (req.headers.password == config.externalPassword) {
        if (!req.query.user) {
            res.send('Missing data.')
        } else {
            let oldBal = userPrem.get(user + '.donated')
            let setNew = (userid, amount) => {
                userPrem.set(userid + '.donated', amount)
            }
console.log(user + ' adding 4 servers. old bal: ' + oldBal)
            setNew(user, 4 + oldBal);

        }
    } else {
        res.send('Invalid Password!')
        console.log(chalk.red('[WARNING] ' + req.headers["x-forwarded-for" || "cf-connecting-ip"] + " tried to access https://danbot.host/external/premium"))
    }
});

// Router.get("/fetch-all", (req, res) => {
//     if (req.headers.password == config.externalPassword) {
//             const data = {
//                 all: userData.all()
//             }
//             res.json(data);
//     } else {
//         res.send('Invalid Password!')
//         console.log(chalk.red('[WARNING] ' + req.headers["x-forwarded-for" || "cf-connecting-ip"] + " tried to access https://danbot.host/external/fetch-all"))
//     }
// });

// Router.get("/fetch-all/prem", (req, res) => {
//     if (req.headers.password == config.externalPassword) {
//             const data = {
//                 all: userPrem.all()
//             }
//             res.json(data);
//     } else {
//         res.send('Invalid Password!')
//         console.log(chalk.red('[WARNING] ' + req.headers["x-forwarded-for" || "cf-connecting-ip"] + " tried to access https://danbot.host/external/fetch-all"))
//     }
// });


// Router.get("/fetch/servers", (req, res) => {
//     if (req.headers.password == config.externalPassword) {
//         if (!req.query.panelID) {
//             res.send('Missing data.')
//         } else {
//             axios({
//                 url: "https://panel.danbot.host" + "/api/application/users/" + req.query.panelID + "?include=servers",
//                 method: 'GET',
//                 followRedirect: true,
//                 maxRedirects: 5,
//                 headers: {
//                     'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
//                     'Content-Type': 'application/json',
//                     'Accept': 'Application/vnd.pterodactyl.v1+json',
//                 }
//             }).then(response => {
//                 if (response == null) {
//                     const data = {
//                         error: "No account found for that user!"
//                     }
//                     res.json(data)
//                 } else {
//                     const data = response;
//                     res.json(data)
//                 }
//             });
//         }
//     } else {
//         res.send('Invalid Password!')
//         console.log(chalk.red('[WARNING] ' + req.headers["x-forwarded-for" || "cf-connecting-ip"] + " tried to access https://danbot.host/external/fetch"))
//     }
// });

module.exports = Router;
