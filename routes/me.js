// route for users to get their own bots
const ms = require('ms')
const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  res.render("me/index.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    bots,
    db
  });
});

Router.get("/servers", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);

  var arr = [];
  axios({
    url: "https://panel.danbot.host" + "/api/application/users/" + userData.get(req.user.id).consoleID + "?include=servers",
    method: 'GET',
    followRedirect: true,
    maxRedirects: 5,
    headers: {
      'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
      'Content-Type': 'application/json',
      'Accept': 'Application/vnd.pterodactyl.v1+json',
    }
  }).then(response => {
    const preoutput = response.data.attributes.relationships.servers.data
    arr.push(...preoutput)
    setTimeout(async () => {
      console.log(arr)
      setTimeout(() => {
        //var clean = arr.map(e => "Server Name: `" + e.attributes.name + "`, Server ID: `" + e.attributes.identifier + "`\n")
        res.render("me/servers.ejs", {
          user: req.isAuthenticated() ? req.user : null,
            table: e,
          db
        });
        //console.log(output)
      }, 500)
    }, 5000)
  });

});

Router.get("/form/new-server", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  res.render("forms/newserver.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    bots,
    db
  });
});

Router.post("/form/new-server", checkAuth, (req, res) => {

  let data = req.body;
  console.log(data);
  res.redirect("/me?e=ERROR");

});

Router.get("/form/staff-apply", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  if (webSettings.fetch("staff-applications.enabled") == "true") {
    res.render("forms/apply-staff.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      bots,
      db
    });
  } else if (webSettings.fetch("staff-applications.enabled") == "false") {
    res.render("forms/apply-staff-closed.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      bots,
      db
    });
  }
});

Router.post("/form/staff-apply", checkAuth, (req, res) => {

  let data = req.body;
  data.member = client.guilds.cache.get('639477525927690240').members.cache.get(data.user);

  if (data.member == null) return res.send({
    error: "You're not a member in out discord server, make sure to join before applying."
  });
  let channel = client.channels.cache.get("813764244008730654");
  try {

    const embed = new Discord.MessageEmbed()
      .setColor(0x00A2E8)
      .addField("__**Ping**__", data.member)
      .addField("__**User ID**__", '`<@' + data.user + '>`')
      .addField("__**age**__", data.age)
      .addField("__**Console Email**__", data.cemail)
      .addField("__**How long have you been in DBH?**__", ms(Date.now() - Date.parse(data.member.joinedAt), {
        long: true
      }))
      .addField("__**Which position are you applying for?**__", data.position)
      .addField("__**Languages**__", data.langs)
      .addField("__**Previous experiences**__", data.prev)
      .addField("__**Coding knowledge**__", data.coding)
      .addField("__**Any projects you are proud of?**__", data.projects)
      .addField("__**Why are you applying?**__", data.why)
      .addField("__**What do you think makes you better than other applicants?**__", data.better)
      .addField("__**What can you offer to the staff team?**__", data.offer)
      .addField("__**Anything else**__", data.else)
      .setTimestamp()
      .setFooter("New staff app submitted!");
    channel.send({
      embed
    })
  } catch (error) {


    let toSend = ""

    toSend += '__**Ping**__\n' + data.member;
    toSend += '\n-------------------------------------\n__**User ID**__\n' + data.member;
    toSend += '\n-------------------------------------\n__**User ID**__\n' + '`<@' + data.user + '>`';
    toSend += '\n-------------------------------------\n__**age**__\n' + data.age;
    toSend += '\n-------------------------------------\n__**Console Email**__\n' + data.cemail;
    toSend += '\n-------------------------------------\n__**How long have you been in DBH?**__\n' + ms(Date.now() - Date.parse(data.member.joinedAt), {
      long: true
    });

    toSend += '\n-------------------------------------\n__**Which position are you applying for?**__\n' + data.position;
    toSend += '\n-------------------------------------\n__**Languages**__\n' + data.langs;
    toSend += '\n-------------------------------------\n__**Previous experiences**__\n' + data.prev;
    toSend += '\n-------------------------------------\n__**Coding knowledge**__\n' + data.coding;
    toSend += '\n-------------------------------------\n__**Any projects you are proud of?**__\n' + data.projects;
    toSend += '\n-------------------------------------\n__**Why are you applying?**__\n' + data.why;
    toSend += '\n-------------------------------------\n__**What do you think makes you better than other applicants?**__\n' + data.better;
    toSend += '\n-------------------------------------\n__**What can you offer to the staff team?**__\n' + data.else;
    toSend += '\n-------------------------------------\n__**Anything else**__\n' + data.else;


    channel.send(toSend).catch(y => {
      const att = new Discord.Attachment(Buffer.from(toSend), data.member.user.tag + ' - ' + data.member.id + '.txt');
      channel.send(data.member, att);
    })
  }

  res.redirect("/me?e=COMPLETE");

});

Router.get("/requests", checkAuth, (req, res) => {
  let bots = db.get(`${req.user.id}.bots`);
  res.render("requests.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    bots,
    db
  });
});

// Router.post("/requests", checkAuth, (req, res) => {

//   let data = req.body;
//   console.log(data);
//   const embed = new Discord.RichEmbed()
//     .setColor(0x00A2E8)
//     .addField("__**Ping**__", `<@${data.id}>`)
//     .addField("__**User ID**__", data.id)
//     .addField("__**Console Email**__", data.cemail)
//     .addField("__**How long have you been in DBH?**__", data.joindate)
//     .addField("__**Previous experiences**__", data.prev)
//     .addField("__**Coding knowledge**__", data.coding)
//     .addField("__**Any projects you are proud of?**__", data.projects)
//     .setTimestamp()
//     .setFooter("New staff app submitted! ");
//   client.channels.get("757204887242014760").send({
//     embed
//   });

//   res.redirect("/me?e=COMPLETE");

// });

module.exports = Router;

/*
 * Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.backURL = req.url;

    res.redirect("/login?redirect=/me");
  }
}
