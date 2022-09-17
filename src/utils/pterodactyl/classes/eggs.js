module.exports = class eggsClass {
    constructor(pterodactyl) {
        this.getEgg = async (nestId, eggId) => {
            const response = await pterodactyl.request(
                `/api/application/nests/${nestId}/eggs/${eggId}?include=variables`,
                'GET'
            );
            return response;
        }
        this.getEggs = async nestId => {
            const response = await pterodactyl.request(
                `/api/application/nests/${nestId}/eggs`,
                'GET'
            );
            return response;
        }
    }
}