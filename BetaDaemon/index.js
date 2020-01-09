/* _____                                __  __                _  _               
  / ____|                              |  \/  |              (_)| |              
 | (___    ___  _ __ __   __ ___  _ __ | \  / |  ___   _ __   _ | |_  ___   _ __ 
  \___ \  / _ \| '__|\ \ / // _ \| '__|| |\/| | / _ \ | '_ \ | || __|/ _ \ | '__|
  ____) ||  __/| |    \ V /|  __/| |   | |  | || (_) || | | || || |_| (_) || |   
 |_____/  \___||_|     \_/  \___||_|   |_|  |_| \___/ |_| |_||_| \__|\___/ |_|  
 Free Monitoring software made by danielpmc                                                       
*/

var PORT = 2001;
var app = require('express')();
var server = require('http').createServer(app);
var request = require("request");
var si = require('systeminformation');
var os = require("os");
var pretty = require('prettysize');
var ping = require('node-http-ping');
var package = require("./package.json");
var config = require("./config.json");

server.listen(PORT, function () {
    console.log(PORT + " listening...");
    ping('0.0.0.0', 2001)
 
});

app.get('/', async function (req, res) {

    setInterval(async () => {
        //Data using the systeminformation package.
        var memdata = await si.mem();
        var ramused = pretty(memdata.used);
        var ramtotal = pretty(memdata.total);
        var diskdata = await si.fsSize();
        var diskused = pretty(diskdata[0].used);
        var disktotal = pretty(diskdata[0].size);
        var netdata = await si.networkStats();
        var netrx = pretty(netdata[0].rx_bytes);
        var nettx = pretty(netdata[0].tx_bytes);
        var osdata = await si.osInfo();
        var bios = await si.bios();
        var ipadd = await si.networkInterfaces();
        var ip = ipadd.ip4

        //CPU data.
        var cpudata = await si.cpu();
        var cpu = os.loadavg();
        var cputhreads = cpudata.cores;
        var cpucores = cpudata.physicalCores;
        var cpumain = os.cpus().length > 0 ? os.cpus()[0].model : 'Uh oh. You dont have a cpu?';

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

        //Version
        var Version = package.version;

        //Fetch time that data was sent. (Used panel sided to check if server has gone offline)
        var datatime = Date.now();

        //Find system OS if windows and else linux (No MacOS support yet, Sorry Apple fans)
        if (osdata.platform == "win32") {
            if (config.debug == true) {
                //Logs that ServerMonitor has found the OS: Windows.
                console.log("Found OS: " + os.platform)
            } else {
                //If debug is disabled.
            }

            console.log('Ew windows.')
        } else if (osdata.platform == "linux") {
            if (config.debug == true) {
                //Logs most things
            } else {
                //If debug is disabled.
            }

            console.log('Well hello there linux :)')
        } else {
            console.log("Your running a unsupported OS. :(")
            process.exit();
        }

        //console.log("http://" + config.panelip + ":" + config.panelport + "/data?servername=" + os.hostname + "&cpuman= " + cpudata.manufacturer + "&cpubrand= " + cpudata.brand + "&cpuload= " + Math.ceil(cpu[1] * 100) / 10 + "&cpuspeed=" + cpudata.speed + "GHz" + "&memused=" + ramused + "&memtotal=" + ramtotal + "&diskused=" + diskused + "&disktotal=" + disktotal + "&netrx=" + netrx + "&nettx=" + nettx + "&osplatform=" + osdata.platform + "&oslogofile=" + osdata.logofile + "&osrelease=" + osdata.release + "&osuptime=" + dDisplay + hDisplay + mDisplay + sDisplay + "&biosvendor=" + bios.vendor + "&biosversion=" + bios.version + "&biosdate=" + bios.releaseDate + "&servermonitorversion=" + Version + "&datatime=" + datatime)
    request({
        uri: "http://" + config.panelip + ":" + config.panelport + "/data?servername=" + os.hostname + "&cpu=" + cpumain + "&cpuload=" + Math.ceil(cpu[1] * 100) / 10 + "&cputhreads=" + cputhreads + "&cpucores=" + cpucores + "&memused=" + ramused + "&memtotal=" + ramtotal + "&diskused=" + diskused + "&disktotal=" + disktotal + "&netrx=" + netrx + "&nettx=" + nettx + "&osplatform=" + osdata.platform + "&oslogofile=" + osdata.logofile + "&osrelease=" + osdata.release + "&osuptime=" + dDisplay + hDisplay + mDisplay + sDisplay + "&biosvendor=" + bios.vendor + "&biosversion=" + bios.version + "&biosdate=" + bios.releaseDate + "&servermonitorversion=" + Version + "&datatime=" + datatime,
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        res.send(body);
    });
}, 2500);   

});
