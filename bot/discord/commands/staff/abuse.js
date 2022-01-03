const parser = require('minimist');

exports.run = async(client, message, args) => {
    if (!message.member.roles.cache.find(r => r.id === "898041747597295667")) return;

    const templates = {
        ratelimit: {
            subject: 'DBH Rate limit ABUSE',
            message: 'Hello {username}, we have noiced you have been repididly hitting our ratelimits on the url {url}\nPlease ceice this behavior if you do not comply you will be banned'
        }
    };

    if (!args[1]) {
        return message.channel.send('Please provide a userID!');
    } else if (!args[2]) {
        return message.channel.send('Please provide a abuse template!');
    } else if (!templates[args[2]] && args[2] != "info") {
        return message.channel.send(`Please provide an availible abuse template! ${Array.from(templates.keys()).join(', ')}`);
    } else if (!args[3]){
        return message.channel.send(`Template data:\nSubject\n\`${templates[args[2]].subject}\`\n\nMessage\n\`${templates[args[2]].message}\``);
    };

    const discordUser = await client.users.fetch(args[1]);
    const DBHUser = userData.get(args[1]);

    const chosenTemplate = templates[args[2]];

    const args = parser(args.join(" ").slice(3));
    args.username = DBHUser.username;
    args.email = DBHUser.email;

    const keys = Array.from(args.keys());
    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        while (chosenTemplate.message.includes(`{${element}}`)) chosenTemplate.message.replace(`{${element}}`, args[element]);
    };

    const dm = await discordUser.send(`${chosenTemplate.subject}\n${chosenTemplate.message}`);

    const emailmessage = {
        from: config.Email.From,
        to: args.email,
        subject: chosenTemplate.subject,
        html: chosenTemplate.message
    };
    transport.sendMail(emailmessage);

    message.channel.send(`I have contacted ${discordUser.tag}
    DM Send: ${dm == null ? ':x:' : ':white_check_mark:'}
    Email Send: :white_check_mark:
    ${chosenTemplate.subject}
    ${chosenTemplate.message}`);

};
