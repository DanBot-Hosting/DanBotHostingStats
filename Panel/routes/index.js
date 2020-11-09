const Router = require("express").Router();
const db = require("quick.db");
const isSnowflake = require(process.cwd() + "/util/isSnowflake.js");

Router.get("/", (req, res) => {
    
  let Query = req.query.q;
  let from = req.query.utm_source;
  let Message = null;
  let MessageDefined = null;
    
  res.render('main.ejs',  {
    user: req.isAuthenticated() ? req.user : null
});
});

Router.get("/Node1", (req, res) => {
    res.redirect("/stats/Node1");
});

Router.get("/Node2", (req, res) => {
    res.redirect("/stats/Node2");
});

Router.get("/Node3", (req, res) => {
    res.redirect("/stats/Node3");
});

Router.get("/Node4", (req, res) => {
  res.redirect("/stats/Node4");
});

//Node status json format
Router.get("/nodeStatus", (req, res) => {
  let data = {
    nodestatus: {
      Node1: nodeStatus.fetch("node1").status,
      Node2: nodeStatus.fetch("node2").status,
      Node3: nodeStatus.fetch("node3").status,
      Node4: nodeStatus.fetch("node4").status,
      Node5: nodeStatus.fetch("node5").status,
      Node6: nodeStatus.fetch("node6").status
    },
    misc: {
      Lava1: nodeStatus.fetch("lava.danbot.host").status,
      Lava2: nodeStatus.fetch("lava2.danbot.host").status,
      Mail: nodeStatus.fetch("mail.danbot.host").status,
      RProxy: nodeStatus.fetch("154.27.68.234").status,
      Panel: nodeStatus.fetch("panel.danbot.host").status,
      AnimalAPI: nodeStatus.fetch("api.danbot.host").status
    }
  };

  res.json(data);
});


Router.get("/bots", (req, res) => {
    let q = req.query.q;
    
    let ar = [];
    let lar = [];
    
    let bots = db.get("bot.IDs");
    for(var i=0; i < bots.length; i++) {
        ar.push(db.get(bots[i]));
        lar.push(db.get(bots[i]));
    }
    ar.sort((a, b) => a.client.username.localeCompare(b.client.username));
   // console.log(ar);
   
    lar.sort(function(a, b) {
        return b.servers - a.servers;
    });
   
    res.render('bots.ejs',  {
       bots: db.get("bot.IDs"),
       db,
       user: req.isAuthenticated() ? req.user : null,
       q,
       ar,
       lar
    });
});

Router.get("/login", (req, res) => {
  let redirect = req.query.redirect;
  if (!redirect) redirect = "/me";
  //console.log(redirect)
  res.redirect(
    "https://discordapp.com/api/oauth2/authorize?client_id=640161047671603205&redirect_uri=https%3A%2F%2Fdanbot.host%2Fapi%2Fcallback&response_type=code&scope=identify&prompt=none&state=" +
      redirect
  );
});

Router.get("/logout", function(req, res) {
  req.session.destroy(() => {
    req.logout();
    //     req.flash('success_msg', 'You are logged out');
    res.redirect("/");
  });
});

Router.get("/feedback", async (req, res) => {
  let Page = "Feedback";
  let ErrorMessage = null;
  let Error = req.query.error;
  if (Error === "not_msg") ErrorMessage = "no_message";
  res.render("feedback.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    ErrorMessage,
  });
});

Router.post("/feedback/post/suggestion", checkAuth, async (req, res) => {
  if (req.body.suggestion) {
    
    // embed
    
      let Kiro = req.isAuthenticated() ? req.user : null;
      let suggestion = req.body.suggestion;
    let SuggestionEmbed = new Discord.RichEmbed()
      .setColor("BLUE")
      .setTitle("Suggestion Submission")
      .setThumbnail(`https://cdn.discordapp.com/avatars/${Kiro.id}/${Kiro.avatar}`)
      .addField("User", `<@${Kiro.id}>(${Kiro.id})`)
      .addField("Suggestion", `${suggestion}`)
  
    suggestionLog.send(SuggestionEmbed)

    res.redirect("/?q=SENT_FEEDBACK");
  } else {
    res.redirect("/feedback?error=not_msg");
  }
});

Router.post("/feedback/post/bug", checkAuth, async (req, res) => {
  if (req.body.bug) {
    
      let Kiro = req.isAuthenticated() ? req.user : null;
  let Bug = req.body.bug;

    let BugEmbed = new Discord.RichEmbed()
      .setColor("BLUE")
      .setTitle("Bug Submission")
      .setThumbnail(`https://cdn.discordapp.com/avatars/${Kiro.id}/${Kiro.avatar}`)
      .addField("User", `<@${Kiro.id}>(${Kiro.id})`)
      .addField("Bug", `${Bug}`);
    
    suggestionLog.send(BugEmbed)

    res.redirect("/?q=SENT_FEEDBACK");
  } else {
    res.redirect("/feedback?error=not_msg");
  }
});

Router.get(["/discord","/support"], (req, res) => {
   res.redirect("//discord.gg/92HBc2Z") 
});

Router.get("/partners", async (req, res) => {
  res.render("partners.ejs", {
    user: req.isAuthenticated() ? req.user : null,
  });
});

module.exports = Router;

 /* Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.backURL = req.url;

    res.redirect("/login?redirect=" + req.url);
  }
}