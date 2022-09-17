module.exports = class locationClass {
    constructor(pterodactyl) {
        this.getLocations = async () => {
            const response = await pterodactyl.request(
                '/api/application/locations?include=nodes',
                'GET'
            );
            return response;
        }
    }
}