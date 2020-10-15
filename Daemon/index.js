var si = require('systeminformation');
var os = require("os");
var pretty = require('prettysize');
var chalk = require('chalk');
var moment = require("moment");
var request = require("request");
var config = require("./config.json");
const speedTest = require('speedtest-net'); 

//Issue speedtest on startup
speedtest();
data();

//Speedtest every 3hours, Then send that data to the panel to store.
setInterval(async () => {
    speedtest()
}, 10800000);

//Send data to the panel every 2seconds 
setInterval(async () => {
    data()
}, 2000)

async function data() {

    //Data using the systeminformation package.
    var memdata = await si.mem();
    var ramused = pretty(memdata.active);
    var ramtotal = pretty(memdata.total);
    var swapused = pretty(memdata.swapused);
    var swaptotal = pretty(memdata.swaptotal);
    var diskdata = await si.fsSize();
    var diskused = pretty(diskdata[0].used);
    var disktotal = pretty(diskdata[0].size);
    var netdata = await si.networkStats();
    var netrx = pretty(netdata[0].rx_bytes);
    var nettx = pretty(netdata[0].tx_bytes);
    var osdata = await si.osInfo();
    var bios = await si.bios();
    var docker = await si.dockerInfo(); 

    //CPU data.
    var cl = await si.currentLoad();
    var cpudata = await si.cpu();
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
    var Version = "1.0.0";

    //Fetch time that data was sent. (Used panel sided to check if server has gone offline)
    var datatime = Date.now();

    var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    request({
        uri: "http://" + config.panelip + ":" + config.panelport + "/data?servername=" + os.hostname +   //OS hostname for saving data panel sided.
            "&cpu=" + cpudata.manufacturer + " " + cpudata.brand +                                         //CPU make and brand.
            "&cpuload=" + cl.currentload.toFixed(2) +                                                      //CPU load but doesn't work on windows :(
            "&cputhreads=" + cputhreads +                                                                  //CPU threads.
            "&cpucores=" + cpucores +                                                                      //CPU cores
            "&memused=" + ramused +                                                                        //Ram used (Auto to MB, GB, TB)
            "&memtotal=" + ramtotal +                                                                      //Ram total (Auto to MB, GB, TB)
            "&swapused=" + swapused +                                                                      //Swap used (Auto to MB, GB, TB)
            "&swaptotal=" + swaptotal +                                                                    //Swap total (Auto to MB, GB, TB)
            "&diskused=" + diskused +                                                                      //Disk used (Auto to MB, GB, TB)
            "&disktotal=" + disktotal +                                                                    //Disk total (Auto to MB, GB, TB)
            "&netrx=" + netrx +                                                                            //Network received (Auto to MB, GB, TB)
            "&nettx=" + nettx +                                                                            //Network transmited (Auto to MB, GB, TB)
            "&osplatform=" + osdata.platform +                                                             //OS platform (win32 or linux)
            "&oslogofile=" + osdata.logofile +                                                             //OS logofile (Linux example: Debian/Ubuntu | Windows example: Windows)
            "&osrelease=" + osdata.release +                                                               //OS release (Linux example: 9 | Windows example: 10.0.18362)
            "&osuptime=" + dDisplay + hDisplay + mDisplay + sDisplay +                                     //OS uptime (Day/Days, Hours/Hour, Minutes/Minute, Seconds/Second)
            "&biosvendor=" + bios.vendor +                                                                 //Bios vendor (Example: Dell Inc)
            "&biosversion=" + bios.version +                                                               //Bios version (Example: A22.00)
            "&biosdate=" + bios.releaseDate +                                                              //Bios release date (Example: 2018-11-29)
            "&servermonitorversion=" + Version +                                                           //ServerMonitor version (Example: 1.0.1)
            "&datatime=" + datatime +                                                                      //Date and time (Example: 1578594094569)
            "&dockercontainers=" + docker.containers +                                                     //Number of docker containers
            "&dockercontainersrunning=" + docker.containersRunning +                                       //Number of running docker containers
            "&dockercontainerspaused=" + docker.containersPaused +                                         //Number of paused docker containers
            "&dockercontainersstopped=" + docker.containersStopped +                                       //Number of stopped docker containers
            "&updatetime= " + timestamp,                                                                   //Last time the node sent data to the panel
        method: "GET",
        timeout: 5000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {

        //Send data to panel
        console.log(chalk.blue(timestamp + chalk.green(' | Data sent to the panel!')))
    
        //Error checking.
        if (error == "undefined") {
            //No errors = Do nothing :D
        } else if (error == "Error: ESOCKETTIMEDOUT") {
            //Because Panel doesn't give response to Daemon it thinks it timed out.
            //But really it didn't data was still sent. 
            //So ignore this error.
        } else if (error == "Error: read ECONNRESET") {
            //Do nothing because panel went down. Program will still continue to try and send data.
            //So ignore this error.
        } else if (error == "Error: connect ECONNREFUSED " + config.panelip + ":" + config.panelport) {
            //Do nothing because panel went down. Program will still continue to try and send data.
            //So ignore this error.
        }else {
            //Log the error in red and exit process
            //console.log(chalk.red("ERROR! " + error))
            return;
      }
    });
}

async function speedtest() {
    var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    const speed = await speedTest({maxTime: 5000, serverId: "36939"})
    speed.on('data', async (data) => {
    request({
        uri: "http://" + config.panelip + ":" + config.panelport + "/data?speedname=" + os.hostname +    //OS hostname for saving data panel sided.
          "&ping=" + data.server.ping +                                                                  //Speedtest Ping. (MS)
          "&download=" + data.speeds.download +                                                          //Download Speed (Mbps)
          "&upload=" + data.speeds.upload +                                                              //Upload Speed (Mbps)
          "&updatetime= " + timestamp,                                                                   //Last time the node sent data to the panel                                                                      //Date and time (Example: 1578594094569)
        method: "GET",
        timeout: 5000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
    
        //Send data to panel
        console.log(chalk.blue(timestamp + chalk.green(' | Speedtest sent to the panel!')))
    
        //Error checking.
        if (error == "undefined") {
            //No errors = Do nothing :D
        } else if (error == "Error: ESOCKETTIMEDOUT") {
            //Because Panel doesn't give response to Daemon it thinks it timed out.
            //But really it didn't data was still sent. 
            //So ignore this error.
        } else if (error == "Error: read ECONNRESET") {
            //Do nothing because panel went down. Program will still continue to try and send data.
            //So ignore this error.
        } else if (error == "Error: connect ECONNREFUSED " + config.panelip + ":" + config.panelport) {
            //Do nothing because panel went down. Program will still continue to try and send data.
            //So ignore this error.
        }else {
            //Log the error in red and exit process
            //console.log(chalk.red("ERROR! " + error))
            return;
      }
    })})} 