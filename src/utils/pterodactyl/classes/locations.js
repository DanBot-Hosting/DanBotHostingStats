module.exports = class locationClass {
    constructor(pterodactyl) {
        this.pterodactyl = pterodactyl;
    }

    async getLocations() {
        const response = await this.pterodactyl.request(
            '/api/application/locations?include=nodes',
            'GET'
        );

        return response;
    }
}