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
var { get } = require('superagent')
var chalk = require('chalk');
var moment = require("moment");
const speedTest = require('speedtest-net'); 

server.listen(PORT, function () {
    console.log(chalk.blueBright("The servers hostname is: " + chalk.green(os.hostname) + ", Please put this in the config file"))
    console.log(PORT + " listening...");
    ping('0.0.0.0', 2001)

    //Config file checking
    if (config.panelip == "Your panel ip here") {
        //Log that the ip has not been set and process will exit.
        console.log(chalk.red("Your panel ip has not been set in config.json. Please set the panel ip."))
        process.exit();
    } else {
        //Panel ip has been set. Ping the panel and see if its alive.
        ping(config.panelip, config.panelport)
            .then(time => console.log(chalk.green(`Panel is online! Response time: ${time}ms`)))
            .catch(() => console.log(chalk.red(`Failed to ping the panel. Please check if the panel is running!`)) + process.exit())
    }
});

if (config.panelping == true) {
    //User requested to ping the panel every x ms
    setInterval(async () => {
    var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
    ping(config.panelip, config.panelport)
        .then(time => console.log(chalk.white(`[${timestamp}]  Panel Pinger:  ` + chalk.green(`Response time: ${time}ms`))))
        .catch(() => console.log(chalk.white(`[${timestamp}]  Panel Pinger:  ` + chalk.red(`Failed to ping the panel. Please check if the panel is running! `) + chalk.white("Will continue to ping panel."))))
    }, config.panelms)
}


app.get('/', async function (req, res) {

    setInterval(async () => {
        //Data using the systeminformation package.
        var memdata = await si.mem();
        var ramused = pretty(memdata.used);
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
        var Version = package.version;

        //Fetch time that data was sent. (Used panel sided to check if server has gone offline)
        var datatime = Date.now();

        //Different errors
        function discordchecker() { 
            if (config.Discord == true) {
                if (config.DiscordWebhook == " ") {
                    console.log(chalk.red("Error: Discord webhooks are enabled but no url is valid. Please enter a valid url or go into the config file and change `Discord: true` to `Discord: false`"));
                } else {
                    //Discord is enabled and webhook has a input. Check for discord webhook link.
                    var WebhookURL = ["https://discordapp.com/api/webhooks/", "https://canary.discordapp.com/api/webhooks/"]
                    if (WebhookURL.some(link => config.DiscordWebhook.includes(link))) {
                        //Webhook config has discord link. Check if link is valid.
                        get(config.DiscordWebhook).end((response) => {
                            console.log("Valid link")

                            if (response.body.type == "1") {
                                console.log(chalk.green("Url valid"))
                            } else {
                                console.log(chalk.red("URL invalid."))
                            }
                        })

                    } else {
                        //Post in console that there is no valid discord link.
                        console.log(chalk.red("Error: Discord webhooks are enabled but the text entered in the config is not a valid discord link."));
                    }
                }
            }
        }

        //Find system OS if windows and else linux (No MacOS support yet, Sorry Apple fans)
        if (osdata.platform == "win32") {
            discordchecker();
            if (config.Docker == true) {
                if (docker.containers == "undefined") {
                    //Docker enabled but no docker found.
                    console.log(chalk.red("You enabled docker in the config but your system does not have docker installed. Please disable this!"));
                    process.exit();
                } else {
                    var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
                    request({
                        uri: "http://" + config.panelip + ":" + config.panelport + "/data?servername=" + os.hostname +   //OS hostname for saving data panel sided.
                          "&cpu=" + cpumain +                                                                            //CPU make and brand.
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
                        res.send(body);
        
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
                            console.log(chalk.red("ERROR! " + error))
                            process.exit();
                        }
        
                    });
                }
            } else {
                var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
                request({
                    uri: "http://" + config.panelip + ":" + config.panelport + "/data?servername=" + os.hostname +   //OS hostname for saving data panel sided.
                      "&cpu=" + cpumain +                                                                            //CPU make and brand.
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
                      "&updatetime= " + timestamp,                                                                   //Last time the node sent data to the panel                                                                      //Date and time (Example: 1578594094569)
                    method: "GET",
                    timeout: 5000,
                    followRedirect: true,
                    maxRedirects: 10
                }, function (error, response, body) {
        
                    //Send data to panel
                    res.send(body);
    
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
                        console.log(chalk.red("ERROR! " + error))
                        process.exit();
                    }
    
                });
            }
        } else if (osdata.platform == "linux") {
            discordchecker();
            if (config.Docker == true) {
                if (docker.containers == "undefined") {
                    //Docker enabled but no docker found.
                    console.log(chalk.red("You enabled docker in the config but your system does not have docker installed. Please disable this!"));
                    process.exit();
                } else {
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
                        res.send(body);
        
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
                        } else if (error == "Error: ETIMEDOUT") {
                            //Do nothing because panel went down. Program will still continue to try and send data.
                            //So ignore this error.
                        }else {
                            //Log the error in red and exit process
                            console.log(chalk.red("ERROR! " + error))
                            process.exit();
                        }
        
                    });
                }
            } else {
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
                      "&updatetime= " + timestamp,                                                                   //Last time the node sent data to the panel
                    method: "GET",
                    timeout: 5000,
                    followRedirect: true,
                    maxRedirects: 10
                }, function (error, response, body) {
                    
                    //Send data to panel
                    res.send(body);
    
                    //Error checking.
                    if (error == "undefined") {
                        //No errors = Do nothing :D
                    } else if (error == "Error: ESOCKETTIMEDOUT") {
                        //Because Panel doesn't give response to Daemon it thinks it timed out.
                        //But really it didn't data was still sent. 
                        //So ignore this error.
                        return;
                    } else if (error == "Error: read ECONNRESET") {
                        //Do nothing because panel went down. Program will still continue to try and send data.
                        //So ignore this error.
                        return;
                    } else if (error == "Error: ETIMEDOUT") {
                        //Do nothing because panel went down. Program will still continue to try and send data.
                        //So ignore this error.
                        return;
                    }else {
                        //Log the error in red and exit process
                        console.log(chalk.red("ERROR! " + error))
                        return;
                    }
    
                });
            }

        } else {
            console.log("Your running a unsupported OS. :(")
            process.exit();
        }

}, 2500);  

setInterval(async () => {
var timestamp = `${moment().format("YYYY-MM-DD HH:mm:ss")}`;
const speed = await speedTest({maxTime: 5000})
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
    res.send(body);

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
        console.log(chalk.red("ERROR! " + error))
        process.exit();
  }
});
});
}, 21600000); 
//}, 20000); 
});
