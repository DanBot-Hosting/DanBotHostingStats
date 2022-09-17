const eggsClass = require('./classes/eggs');
const locationClass = require('./classes/locations');
const nodeClass = require('./classes/nodes');
const serverClass = require('./classes/server');
const userClass = require('./classes/user');
const axios = require('axios');
const config = require("../../config.json");

module.exports = class Pterodactyl {
    constructor() {
        // Later I'll add jsdoc
        const eggs = new eggsClass(this);
        this.getEgg = eggs.getEgg;
        this.getEggs = eggs.getEggs;
        const locations = new locationClass(this);
        this.getLocations = locations.getLocations;
        const nodes = new nodeClass(this);
        this.getAllocations = nodes.getAllocations;
        this.getNodes = nodes.getNodes;
        this.getServers = nodes.getServers;
        const server = new serverClass(this);
        this.createServer = server.createServer;
        this.deleteServer = server.deleteServer;
        this.servers = server.servers;
        const user = new userClass(this);
        this.createUser = user.createUser;
        this.deleteUser = user.deleteUser;
        this.userDetails = user.userDetails;
        this.fetchUsers = user.fetchUsers;
        this.resetPassword = user.resetPassword;
        this.updateUser = user.updateUser;

        /**
         * @param {String} endpoint - Pterodactyl panel endpoint (starting with "/")
         * @param {String} method - GET, POST, DELETE, PATCH, PUT methods
         * @param {Object} data - An object with several keys depending on endpoint
         * @returns an object with 2 keys: "error" (boolean) and "data" (object)
         */
        this.request = async (
            endpoint,
            method,
            data = {}
        ) => {
            try {
                const response = await axios({
                    url: config.pterodactyl.panelUrl + endpoint,
                    method: method,
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': `Bearer ${config.pterodactyl.adminKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    },
                    data: data
                });
                return {
                    error: false,
                    data: response.data
                };
            } catch (error) {
                return {
                    error: true,
                    data: error?.response?.data?.message
                }
            }
        }
    }
}