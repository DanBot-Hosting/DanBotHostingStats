const eggsClass = require('./classes/eggs');
const locationClass = require('./classes/locations');
const nodeClass = require('./classes/nodes');
const serverClass = require('./classes/server');
const userClass = require('./classes/user');
const axios = require('axios');
const config = require("../../config.json");

module.exports = class Pterodactyl {
    constructor() {

        /**
         * @param {String} endpoint - Pterodactyl panel endpoint (starting with "/")
         * @param {String} method - GET, POST, DELETE, PATCH, PUT methods
         * @param {Object} data - An object with several keys depending on endpoint
         * @returns an object with 2 keys: "error" (boolean) and "data" (object)
         */
        this.request = async (endpoint, method, data = {}) => {
            try {
                const response = await axios({
                    url: config.pterodactyl.panelUrl + endpoint,
                    method: method,
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': `Bearer ${config.pterodactyl.apiKey}`,
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

        this.eggs = new eggsClass(this);

        this.locations = new locationClass(this);

        this.nodes = new nodeClass(this);

        this.server = new serverClass(this);

        this.user = new userClass(this);
    }
}