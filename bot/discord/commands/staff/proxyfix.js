async function getNewKey(){
    const serverRes = await axios({
        url: config.proxy.url + "/api/tokens",
        method: 'POST',
        followRedirect: true,
        maxRedirects: 5,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "identity": config.proxy.email,
            "secret": config.proxy.pass
        }
    });
    return "Bearer " + serverRes.data.token;
};

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041751099539497")) return;

    if (!args[1]) {
        return message.channel.send('Please provide a URL! WARNING: Do not use this command without checking the domain is not already linked!');

    } else {
        const replyMsg = await message.channel.send('Trying to fix proxy...');
        config.proxy.authKey = await getNewKey();
        replyMsg.edit('Trying to fix proxy...\nAuthenticated')

        const listOfUrls = await axios({
            url: config.proxy.url + "/api/nginx/proxy-hosts?expand=owner,access_list,certificate",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': config.proxy.authKey,
                'Content-Type': 'application/json',
            }
        });

        let idOfProxy = null;
        for (let index = 0; index < listOfUrls.data.length; index++) {
            const proxyObject = listOfUrls.data[index];
            if (proxyObject.domain_names.includes(args[1])) idOfProxy = proxyObject.id;
        };

        if (!idOfProxy){
            replyMsg.edit('Trying to fix proxy...\nAuthenticated\nThis domain should work... did you do a typo?')
        } else {
            replyMsg.edit(`Trying to fix proxy...\nAuthenticated\nFound domain ${idOfProxy}, attempting to delete...`)

            const deletedObject = await axios({
                url: config.proxy.url + `/api/nginx/proxy-hosts/${idOfProxy}`,
                method: 'DELETE',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': config.proxy.authKey,
                    'Content-Type': 'application/json',
                }
            });

            if (deletedObject) {
                replyMsg.edit(`Trying to fix proxy...\nAuthenticated\nFound domain ${idOfProxy}, attempting to delete...\nDomain should now work, please ensure there is a DNS record pointing to the DBH proxy and also cloudflare proxy is disabled`)
            } else {
                replyMsg.edit(`Trying to fix proxy...\nAuthenticated\nFound domain ${idOfProxy}, attempting to delete...\nFailed to delete! Try again?`)
            };
        };
    };
};
