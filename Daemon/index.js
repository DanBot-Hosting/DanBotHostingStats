var express = require("express");
var app = express();
var server = require("http").createServer(app);
var db = require("quick.db")
var nodeData = new db.table("nodeData");
var si = require('systeminformation');
var os = require("os");
var pretty = require('prettysize');
var moment = require("moment");
var config = require("./config.json");
const speedTest = require('speedtest-net'); 
var PORT = "999"

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

app.get('/stats', function (req, res) {
    let data = {
        info: nodeData.fetch("data"),
        speedtest: nodeData.fetch("data-speedtest")
    }
    res.send(data)
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
        servername: os.hostname,
        cpu: cpudata.manufacturer + " " + cpudata.brand,
        cpuload: cl.currentload.toFixed(2),
        cputhreads: cpudata.cores,
        cpucores: cpudata.physicalCores,
        memused: pretty(memdata.active),
        memtotal: pretty(memdata.total),
        swapused: pretty(memdata.swapused),
        swaptotal: pretty(memdata.swaptotal),
        diskused: pretty(diskdata[0].used),
        disktotal: pretty(diskdata[0].size),
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
            speedname: os.hostname,
            ping: data.server.ping,
            download: data.speeds.download,
            upload: data.speeds.upload,
            updatetime: timestamp
        });
    })
}