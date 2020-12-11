var express = require("express");
var app = express();
var server = require("http").createServer(app);
var db = require("quick.db")
var nodeData = new db.table("nodeData");
var si = require('systeminformation');
var os = require("os");
var pretty = require('prettysize');
var moment = require("moment");
const speedTest = require('speedtest-net'); 
const fs = require('fs')
const config = require('./config.json')
const exec = require('child_process').exec;
var PORT = "999"

//Automatic 30second git pull.
setInterval(() => {
    exec(`git pull`, (error, stdout) => {
        let response = (error || stdout);
        if (!error) {
            if (response.includes("Already up to date.")) {
            } else {
                console.log("**[AUTOMATIC]** New update on GitHub.")
                setTimeout(() => {
                    process.exit();
                }, 1000)
            };
        }
    })
}, 30000)

//Issue speedtest on startup
speedtest();
fetchData();

//Speedtest every 3hours, Then send that data to the panel to store.
setInterval(async () => {
    speedtest()
}, 10800000);

//Send data to the panel every 2seconds 
setInterval(async () => {
    fetchData()
}, 2000)

app.get("/states", (req, res) => {
    if (req.headers.password == config.password) {
        exec(`cat /var/lib/pterodactyl/states.json`, (error, stdout) => {

            let response = (error || stdout);

            res.json(response)
        })
    } else {
        res.send(`<style>
    .video{position:absolute;top:0;left:0;height:100%;width:100%;object-fit:cover}
  }
</style>
<video class= "video""
  autoplay=""
  mqn-video-inview-no-reset="" mqn-video-inview-play="" loop playsinline="">

<source src="http://shitcord.xyz/Rick_Astley___Never_Gonna_Give_You_Up__Video_.mp4" type="video/mp4">

</video>`)
    }
})

app.get("/", (req, res) => {
    res.send(`<style>
    .video{position:absolute;top:0;left:0;height:100%;width:100%;object-fit:cover}
  }
</style>
<video class= "video""
  autoplay=""
  mqn-video-inview-no-reset="" mqn-video-inview-play="" loop playsinline="">

<source src="http://shitcord.xyz/Rick_Astley___Never_Gonna_Give_You_Up__Video_.mp4" type="video/mp4">

</video>`)
});

app.get('/stats', function (req, res) {
    if (req.headers.password == config.password) {
        let data = {
            info: nodeData.fetch("data"),
            speedtest: nodeData.fetch("data-speedtest")
        }
        res.send(data)
    } else {
        res.send(`<style>
    .video{position:absolute;top:0;left:0;height:100%;width:100%;object-fit:cover}
  }
</style>
<video class= "video""
  autoplay=""
  mqn-video-inview-no-reset="" mqn-video-inview-play="" loop playsinline="">

<source src="http://shitcord.xyz/Rick_Astley___Never_Gonna_Give_You_Up__Video_.mp4" type="video/mp4">

</video>`)
    }
})

app.get('/wings', function (req, res) {
    if (req.headers.password == config.password) {
        console.log(req.query)
        if (!req.query.action) {
            res.json({ status: "You forgot to send start/restart/stop in the request"})
        } else if (req.query.action == "start") {
            res.json({ status: "Wings started" })
            exec(`service wings start`)
        } else if (req.query.action == "restart") {
            res.json({ status: "Wings restarted" })
            exec(`service wings restart`)
        } else if (req.query.action == "stop") {
            res.json({ status: "Wings stopped" })
            exec(`service wings stop`)
        }
    } else {
        res.send(`<style>
    .video{position:absolute;top:0;left:0;height:100%;width:100%;object-fit:cover}
  }
</style>
<video class= "video""
  autoplay=""
  mqn-video-inview-no-reset="" mqn-video-inview-play="" loop playsinline="">

<source src="http://shitcord.xyz/Rick_Astley___Never_Gonna_Give_You_Up__Video_.mp4" type="video/mp4">

</video>`)
    }
})

server.listen(PORT, function () {
    console.log("Waiting for connections...");
});



//DATA COLLECTION
async function fetchData() {
    //Data using the systeminformation package.
    var memdata = await si.mem();
    var diskdata = await si.fsSize();
    var netdata = await si.networkStats();
    var osdata = await si.osInfo();
    var bios = await si.bios();
    var docker = await si.dockerInfo(); 
    var cl = await si.currentLoad();
    var cpudata = await si.cpu();

    //OS UPTIME
    var uptime = os.uptime();
    var d = Math.floor(uptime / (3600*24));
    var h = Math.floor(uptime % (3600*24) / 3600);
    var m = Math.floor(uptime % 3600 / 60);
    var s = Math.floor(uptime % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    nodeData.set("data", {
        servername: os.hostname(),
        cpu: cpudata.manufacturer + " " + cpudata.brand,
        cpuload: cl.currentload.toFixed(2),
        cputhreads: cpudata.cores,
        cpucores: cpudata.physicalCores,
        memused: pretty(memdata.active),
        memtotal: pretty(memdata.total),
        memusedraw: memdata.active,
        memtotalraw: memdata.total,
        swapused: pretty(memdata.swapused),
        swaptotal: pretty(memdata.swaptotal),
        swapusedraw: memdata.swapused,
        swaptotalraw: memdata.swaptotal,
        diskused: pretty(diskdata[0].used),
        disktotal: pretty(diskdata[0].size),
        diskusedraw: diskdata[0].used,
        disktotalraw: diskdata[0].size,
        netrx: pretty(netdata[0].rx_bytes),
        nettx: pretty(netdata[0].tx_bytes),
        osplatform: osdata.platform,
        oslogofile: osdata.logofile,
        osrelease: osdata.release,
        osuptime: dDisplay + hDisplay + mDisplay + sDisplay,
        biosvendor: bios.vendor,
        biosversion: bios.version,
        biosdate: bios.releaseDate,
        servermonitorversion: "CUSTOM",
        datatime: Date.now(),
        dockercontainers: docker.containers,
        dockercontainersrunning: docker.containersRunning,
        dockercontainerspaused: docker.containersPaused,
        dockercontainersstopped: docker.containersStopped,
        updatetime: moment().format("YYYY-MM-DD HH:mm:ss")
      });
}

async function speedtest() {
    var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    const speed = await speedTest({maxTime: 5000, serverId: "36939"})
    speed.on('data', async (data) => {
        nodeData.set('data-speedtest', {
            speedname: os.hostname(),
            ping: data.server.ping,
            download: data.speeds.download,
            upload: data.speeds.upload,
            updatetime: timestamp
        });
    })
}