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
      Node1: nodeStatus.fetch("node1"),
      Node2: nodeStatus.fetch("node2"),
      Node3: nodeStatus.fetch("node3"),
      Node4: nodeStatus.fetch("node4"),
      Node5: nodeStatus.fetch("node5"),
      Node6: nodeStatus.fetch("node6"),
      Node7: nodeStatus.fetch("node7")
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

//System info
Router.get("/sysinfo", (req, res) => {
  let data = {
    Node1: {
      info: {
        cpu: nodeData.fetch("Node1.cpu"),
        cpuload: nodeData.fetch("Node1.cpuload"),
        cputhreads: nodeData.fetch("Node1.cputhreads"),
        cpucores: nodeData.fetch("Node1.cpucores"),
        memused: nodeData.fetch("Node1.memused"),
        memtotal: nodeData.fetch("Node1.memtotal"),
        swapused: nodeData.fetch("Node1.swap"),
        swaptotal: nodeData.fetch("Node1.swaptotal"),
        diskused: nodeData.fetch("Node1.diskused"), 
        disktotal: nodeData.fetch("Node1.disktotal"),
        netrx: nodeData.fetch("Node1.netrx"),
        nettx: nodeData.fetch("Node1.nettx"),
        osplatform: nodeData.fetch("Node1.osplatform"),
        oslogofile: nodeData.fetch("Node1.oslogofile"),
        osrelease: nodeData.fetch("Node1.osrelease"),
        osuptime: nodeData.fetch("Node1.osuptime"),
        biosvendor: nodeData.fetch("Node1.biosvender"),
        biosversion: nodeData.fetch("Node1.biosversion"),
        biosdate: nodeData.fetch("Node1.biosdate"),
        dockercontainers: nodeData.fetch("Node1.dockercontainers"),
        dockercontainersrunning: nodeData.fetch("Node1.dockercontainersrunning"),
        dockercontainerspaused: nodeData.fetch("Node1.dockercontainerspaused"),
        dockercontainersstopped: nodeData.fetch("Node1.dockercontainersstopped"),
        lastupdate: nodeData.fetch("Node1.updatetime")
      },
      speedtest: {
        ping: nodeData.fetch("Node1-speedtest.ping"),
        download: nodeData.fetch("Node1-speedtest.download"),
        upload: nodeData.fetch("Node1-speedtest.upload"),
        lastupdate: nodeData.fetch("Node1-speedtest.updatetime")
      }
    },
    Node2: {
      info: {
        cpu: nodeData.fetch("Node2.cpu"),
        cpuload: nodeData.fetch("Node2.cpuload"),
        cputhreads: nodeData.fetch("Node2.cputhreads"),
        cpucores: nodeData.fetch("Node2.cpucores"),
        memused: nodeData.fetch("Node2.memused"),
        memtotal: nodeData.fetch("Node2.memtotal"),
        swapused: nodeData.fetch("Node2.swap"),
        swaptotal: nodeData.fetch("Node2.swaptotal"),
        diskused: nodeData.fetch("Node2.diskused"), 
        disktotal: nodeData.fetch("Node2.disktotal"),
        netrx: nodeData.fetch("Node2.netrx"),
        nettx: nodeData.fetch("Node2.nettx"),
        osplatform: nodeData.fetch("Node2.osplatform"),
        oslogofile: nodeData.fetch("Node2.oslogofile"),
        osrelease: nodeData.fetch("Node2.osrelease"),
        osuptime: nodeData.fetch("Node2.osuptime"),
        biosvendor: nodeData.fetch("Node2.biosvender"),
        biosversion: nodeData.fetch("Node2.biosversion"),
        biosdate: nodeData.fetch("Node2.biosdate"),
        dockercontainers: nodeData.fetch("Node2.dockercontainers"),
        dockercontainersrunning: nodeData.fetch("Node2.dockercontainersrunning"),
        dockercontainerspaused: nodeData.fetch("Node2.dockercontainerspaused"),
        dockercontainersstopped: nodeData.fetch("Node2.dockercontainersstopped"),
        lastupdate: nodeData.fetch("Node2.updatetime")
      },
      speedtest: {
        ping: nodeData.fetch("Node2-speedtest.ping"),
        download: nodeData.fetch("Node2-speedtest.download"),
        upload: nodeData.fetch("Node2-speedtest.upload"),
        lastupdate: nodeData.fetch("Node2-speedtest.updatetime")
      }
    },
    Node3: {
      info: {
        cpu: nodeData.fetch("Node3.cpu"),
        cpuload: nodeData.fetch("Node3.cpuload"),
        cputhreads: nodeData.fetch("Node3.cputhreads"),
        cpucores: nodeData.fetch("Node3.cpucores"),
        memused: nodeData.fetch("Node3.memused"),
        memtotal: nodeData.fetch("Node3.memtotal"),
        swapused: nodeData.fetch("Node3.swap"),
        swaptotal: nodeData.fetch("Node3.swaptotal"),
        diskused: nodeData.fetch("Node3.diskused"), 
        disktotal: nodeData.fetch("Node3.disktotal"),
        netrx: nodeData.fetch("Node3.netrx"),
        nettx: nodeData.fetch("Node3.nettx"),
        osplatform: nodeData.fetch("Node3.osplatform"),
        oslogofile: nodeData.fetch("Node3.oslogofile"),
        osrelease: nodeData.fetch("Node3.osrelease"),
        osuptime: nodeData.fetch("Node3.osuptime"),
        biosvendor: nodeData.fetch("Node3.biosvender"),
        biosversion: nodeData.fetch("Node3.biosversion"),
        biosdate: nodeData.fetch("Node3.biosdate"),
        dockercontainers: nodeData.fetch("Node3.dockercontainers"),
        dockercontainersrunning: nodeData.fetch("Node3.dockercontainersrunning"),
        dockercontainerspaused: nodeData.fetch("Node3.dockercontainerspaused"),
        dockercontainersstopped: nodeData.fetch("Node3.dockercontainersstopped"),
        lastupdate: nodeData.fetch("Node3.updatetime")
      },
      speedtest: {
        ping: nodeData.fetch("Node3-speedtest.ping"),
        download: nodeData.fetch("Node3-speedtest.download"),
        upload: nodeData.fetch("Node3-speedtest.upload"),
        lastupdate: nodeData.fetch("Node3-speedtest.updatetime")
      }
    },
    Node4: {
      info: {
        cpu: nodeData.fetch("Node4.cpu"),
        cpuload: nodeData.fetch("Node4.cpuload"),
        cputhreads: nodeData.fetch("Node4.cputhreads"),
        cpucores: nodeData.fetch("Node4.cpucores"),
        memused: nodeData.fetch("Node4.memused"),
        memtotal: nodeData.fetch("Node4.memtotal"),
        swapused: nodeData.fetch("Node4.swap"),
        swaptotal: nodeData.fetch("Node4.swaptotal"),
        diskused: nodeData.fetch("Node4.diskused"), 
        disktotal: nodeData.fetch("Node4.disktotal"),
        netrx: nodeData.fetch("Node4.netrx"),
        nettx: nodeData.fetch("Node4.nettx"),
        osplatform: nodeData.fetch("Node4.osplatform"),
        oslogofile: nodeData.fetch("Node4.oslogofile"),
        osrelease: nodeData.fetch("Node4.osrelease"),
        osuptime: nodeData.fetch("Node4.osuptime"),
        biosvendor: nodeData.fetch("Node4.biosvender"),
        biosversion: nodeData.fetch("Node4.biosversion"),
        biosdate: nodeData.fetch("Node4.biosdate"),
        dockercontainers: nodeData.fetch("Node4.dockercontainers"),
        dockercontainersrunning: nodeData.fetch("Node4.dockercontainersrunning"),
        dockercontainerspaused: nodeData.fetch("Node4.dockercontainerspaused"),
        dockercontainersstopped: nodeData.fetch("Node4.dockercontainersstopped"),
        lastupdate: nodeData.fetch("Node4.updatetime")
      },
      speedtest: {
        ping: nodeData.fetch("Node4-speedtest.ping"),
        download: nodeData.fetch("Node4-speedtest.download"),
        upload: nodeData.fetch("Node4-speedtest.upload"),
        lastupdate: nodeData.fetch("Node4-speedtest.updatetime")
      }
    },
    Node5: {
      info: {
        cpu: nodeData.fetch("Node5.cpu"),
        cpuload: nodeData.fetch("Node5.cpuload"),
        cputhreads: nodeData.fetch("Node5.cputhreads"),
        cpucores: nodeData.fetch("Node5.cpucores"),
        memused: nodeData.fetch("Node5.memused"),
        memtotal: nodeData.fetch("Node5.memtotal"),
        swapused: nodeData.fetch("Node5.swap"),
        swaptotal: nodeData.fetch("Node5.swaptotal"),
        diskused: nodeData.fetch("Node5.diskused"), 
        disktotal: nodeData.fetch("Node5.disktotal"),
        netrx: nodeData.fetch("Node5.netrx"),
        nettx: nodeData.fetch("Node5.nettx"),
        osplatform: nodeData.fetch("Node5.osplatform"),
        oslogofile: nodeData.fetch("Node5.oslogofile"),
        osrelease: nodeData.fetch("Node5.osrelease"),
        osuptime: nodeData.fetch("Node5.osuptime"),
        biosvendor: nodeData.fetch("Node5.biosvender"),
        biosversion: nodeData.fetch("Node5.biosversion"),
        biosdate: nodeData.fetch("Node5.biosdate"),
        dockercontainers: nodeData.fetch("Node5.dockercontainers"),
        dockercontainersrunning: nodeData.fetch("Node5.dockercontainersrunning"),
        dockercontainerspaused: nodeData.fetch("Node5.dockercontainerspaused"),
        dockercontainersstopped: nodeData.fetch("Node5.dockercontainersstopped"),
        lastupdate: nodeData.fetch("Node5.updatetime")
      },
      speedtest: {
        ping: nodeData.fetch("Node5-speedtest.ping"),
        download: nodeData.fetch("Node5-speedtest.download"),
        upload: nodeData.fetch("Node5-speedtest.upload"),
        lastupdate: nodeData.fetch("Node5-speedtest.updatetime")
      }
    },
    Node6: {
      info: {
        cpu: nodeData.fetch("Node6.cpu"),
        cpuload: nodeData.fetch("Node6.cpuload"),
        cputhreads: nodeData.fetch("Node6.cputhreads"),
        cpucores: nodeData.fetch("Node6.cpucores"),
        memused: nodeData.fetch("Node6.memused"),
        memtotal: nodeData.fetch("Node6.memtotal"),
        swapused: nodeData.fetch("Node6.swap"),
        swaptotal: nodeData.fetch("Node6.swaptotal"),
        diskused: nodeData.fetch("Node6.diskused"), 
        disktotal: nodeData.fetch("Node6.disktotal"),
        netrx: nodeData.fetch("Node6.netrx"),
        nettx: nodeData.fetch("Node6.nettx"),
        osplatform: nodeData.fetch("Node6.osplatform"),
        oslogofile: nodeData.fetch("Node6.oslogofile"),
        osrelease: nodeData.fetch("Node6.osrelease"),
        osuptime: nodeData.fetch("Node6.osuptime"),
        biosvendor: nodeData.fetch("Node6.biosvender"),
        biosversion: nodeData.fetch("Node6.biosversion"),
        biosdate: nodeData.fetch("Node6.biosdate"),
        dockercontainers: nodeData.fetch("Node6.dockercontainers"),
        dockercontainersrunning: nodeData.fetch("Node6.dockercontainersrunning"),
        dockercontainerspaused: nodeData.fetch("Node6.dockercontainerspaused"),
        dockercontainersstopped: nodeData.fetch("Node6.dockercontainersstopped"),
        lastupdate: nodeData.fetch("Node6.updatetime")
      },
      speedtest: {
        ping: nodeData.fetch("Node6-speedtest.ping"),
        download: nodeData.fetch("Node6-speedtest.download"),
        upload: nodeData.fetch("Node6-speedtest.upload"),
        lastupdate: nodeData.fetch("Node6-speedtest.updatetime")
      }
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