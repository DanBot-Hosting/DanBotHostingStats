module.exports = class eggsClass {
    constructor(pterodactyl) {
        this.pterodactyl = pterodactyl;
    }

    async getEgg(nestId, eggId) {
        const response = await this.pterodactyl.request(
            `/api/application/nests/${nestId}/eggs/${eggId}?include=variables`,
            'GET'
        );

        return response;
    }

    async getEggs(nestId) {
        const response = await this.pterodactyl.request(
            `/api/application/nests/${nestId}/eggs`,
            'GET'
        );

        return response;
    }
}