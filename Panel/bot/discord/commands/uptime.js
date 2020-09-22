exports.run = async(client, message, args) => {

    var getUptime = function(millis) {
        var dur = {};
        var units = [{
                label: "milliseconds",
                mod: 1000
            },
            {
                label: "seconds",
                mod: 60
            },
            {
                label: "minutes",
                mod: 60
            },
            {
                label: "hours",
                mod: 24
            },
            {
                label: "days",
                mod: 31
            }
        ];
    
        units.forEach(function(u) {
            millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
        });
    
        var nonZero = function(u) {
            return dur[u.label];
        };
        dur.toString = function() {
            return units
                .reverse()
                .filter(nonZero)
                .map(function(u) {
                    return dur[u.label] + " " + (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label);
                })
                .join(', ');
        };
        return dur;
    };

let myDate = new Date(client.readyTimestamp);
        var embed = new Discord.RichEmbed()
        .addField(":white_check_mark: Uptime:", `**${getUptime(client.uptime)}**`)
        .setFooter(`Ready Timestamp: ${myDate.toString()}`)
        .setColor("GREEN")
        message.channel.send(embed);
    }