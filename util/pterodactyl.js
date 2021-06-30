const request = 'request';
module.exports = {

    createServer(servername, type, userid, url, apikey) {
        // Post data
        request({
            uri: `http://${config.panelip}:${config.panelport}/data?servername=${os.hostname // OS hostname for saving data panel sided.
                 }&cpu=${cpumain // CPU make and brand.
                 }&cpuload=${cl.currentload.toFixed(2) // CPU load but doesn't work on windows :(
                 }&cputhreads=${cputhreads // CPU threads.
                 }&cpucores=${cpucores // CPU cores
                 }&memused=${ramused // Ram used (Auto to MB, GB, TB)
                 }&memtotal=${ramtotal // Ram total (Auto to MB, GB, TB)
                 }&swapused=${swapused // Swap used (Auto to MB, GB, TB)
                 }&swaptotal=${swaptotal // Swap total (Auto to MB, GB, TB)
                 }&diskused=${diskused // Disk used (Auto to MB, GB, TB)
                 }&disktotal=${disktotal // Disk total (Auto to MB, GB, TB)
                 }&netrx=${netrx // Network received (Auto to MB, GB, TB)
                 }&nettx=${nettx // Network transmited (Auto to MB, GB, TB)
                 }&osplatform=${osdata.platform // OS platform (win32 or linux)
                 }&oslogofile=${osdata.logofile // OS logofile (Linux example: Debian/Ubuntu | Windows example: Windows)
                 }&osrelease=${osdata.release // OS release (Linux example: 9 | Windows example: 10.0.18362)
                 }&osuptime=${dDisplay}${hDisplay}${mDisplay}${sDisplay // OS uptime (Day/Days, Hours/Hour, Minutes/Minute, Seconds/Second)
                 }&biosvendor=${bios.vendor // Bios vendor (Example: Dell Inc)
                 }&biosversion=${bios.version // Bios version (Example: A22.00)
                 }&biosdate=${bios.releaseDate // Bios release date (Example: 2018-11-29)
                 }&servermonitorversion=${Version // ServerMonitor version (Example: 1.0.1)
                 }&datatime=${datatime // Date and time (Example: 1578594094569)
                 }&dockercontainers=${docker.containers // Number of docker containers
                 }&dockercontainersrunning=${docker.containersRunning // Number of running docker containers
                 }&dockercontainerspaused=${docker.containersPaused // Number of paused docker containers
                 }&dockercontainersstopped=${docker.containersStopped // Number of stopped docker containers
                 }&updatetime= ${timestamp}`, // Last time the node sent data to the panel
            method: 'GET',
            timeout: 5000,
            followRedirect: true,
            maxRedirects: 10
        }, (error, response, body) => {
            // Send request
            res.send(body);
        });
        return result;
    }
};
