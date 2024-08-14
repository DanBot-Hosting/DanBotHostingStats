const Config = require('../config.json');

const Proxies = [
    {
        name: "United States 1",            //The name to be displayed on embeds.
        dbLocation: "US1",                  //The location within the database.
        url: Config.USProxy1.url,           //The URL for requests.
        ip: "69.197.135.202",               //The IP for the proxy.
        email: Config.USProxy1.email,       //The email for the Administrator Account.
        pass: Config.USProxy1.pass,         //The password for the Administrator Account.
        premiumOnly: false,                 //If the proxy is only available to premium users.
    },
    {
        name: "United States 2",
        dbLocation: "US2",
        url: Config.USProxy2.url,
        ip: "69.197.135.203",
        email: Config.USProxy2.email,
        pass: Config.USProxy2.pass,
        premiumOnly: false
    },
    {
        name: "United States 3",
        dbLocation: "US3",
        url: Config.USProxy3.url,
        ip: "69.197.135.204",
        email: Config.USProxy3.email,
        pass: Config.USProxy3.pass,
        premiumOnly: false
    },
    {
        name: "United States 4",
        dbLocation: "US4",
        url: Config.USProxy4.url,
        ip: "69.197.135.205",
        email: Config.USProxy4.email,
        pass: Config.USProxy4.pass,
        premiumOnly: false
    },
    {
        name: "Donator 1",
        dbLocation: "DonatorProxy",
        url: Config.DonatorProxy.url,
        ip: "69.30.249.53",
        email: Config.DonatorProxy.email,
        pass: Config.DonatorProxy.pass,
        premiumOnly: true
    },
    
]

const PremiumDomains = [
    "only-fans.club",
    "is-a-awesome.dev",
    "is-a-cool.dev"
]

module.exports = { Proxies, PremiumDomains};