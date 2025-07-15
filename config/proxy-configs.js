const Config = require('../config.json');

const Proxies = [
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

module.exports = { Proxies, PremiumDomains };
