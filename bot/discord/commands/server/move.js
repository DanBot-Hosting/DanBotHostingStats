const axios = require('axios');
const exec = require('child_process').exec;


exports.run = async(client, message, args) => {
    message.channel.send('Command coming soon! almost finished :D')
    /*
    if (!args[1]) {
        message.channel.send('Command format: `DBH!server move serverid node`')
    } else if (!args[2]) {
        message.channel.send('Command format: `DBH!server move serverid node`')
    }
    //User ID of who owns the server
    let userID = 1;

    //Server ID to move
    let serverID = 'server id to move';

    //Move from node ip
    let mfn = "ip here";

    //Move to node ip
    let mtn = "ip here";


    axios({
        url: config.Pterodactyl.hosturl + "/api/application/users/" + userID + "?include=servers",
        method: 'GET',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
            'Content-Type': 'application/json',
            'Accept': 'Application/vnd.pterodactyl.v1+json',
        }
    }).then(input => {

        input = input.data.attributes;
        if (input.relationships) {
            let k = Object.keys(input.relationships);
            input.extras = {};
            k.forEach(key => {
                if (input.relationships[key].data != null)
                    input.extras[key] = input.relationships[key].data.map(a => a.attributes);
                else
                    input.extras[key] = input.relationships[key];
            })
            delete input.relationships;
        }

        if (input.extras.servers == null || input.extras.servers.find(x => x.identifier === serverID) == null) {
            console.log('You dont own that server.');
            return;
        }
        let server = input.extras.servers.find(x => x.identifier === serverID);

        if (server.node === 7 | server.node === 3) {
            console.log('Unsupported node.');
            return;
        }


        const data = {
            "name": server.name,
            "user": userID,
            "nest": server.nest,
            "egg": server.egg,
            "docker_image": server.container.image,
            "startup": server.container.startup_command,
            "limits": {
                "memory": 0,
                "swap": -1,
                "disk": 0,
                "io": 500,
                "cpu": 0
            },
            "environment": server.container.environment,

            "feature_limits": server.feature_limits,
            "deploy": {
                "locations": [11],
                "dedicated_ip": false,
                "port_range": []
            },
            'oom_disabled': true,
            "start_on_completion": false
        };


        axios({
            url: config.Pterodactyl.hosturl + "/api/application/servers",
            method: 'POST',
            data: data,
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(async s => {
            console.log('New server created. Moving files');
            exec(`rsync -avz --timeout=10 root@${mfn}:/srv/daemon-data/${server.uuid}\/* /root/Moved/${server.uuid}/ && rsync -avz --timeout=10  /root/Moved/${server.uuid}\/* root@${mtn}:/var/lib/pterodactyl/volumes/${s.data.attributes.uuid}/`, (error, stdout) => {

                let response = (error || stdout);

                console.log(response)
                if (response === "") {
                    console.log('Server moved!')
                } else {
                    console.log('Server failed moving. try again later')
                }
            })
        }).catch(() => {
            console.log('Error with node...');
        })
    })

     */
}
