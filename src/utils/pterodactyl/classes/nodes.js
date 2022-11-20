module.exports = class nodeClass {
    constructor(pterodactyl) {
        this.pterodactyl = pterodactyl;
    }

    async getAllocations(nodeId) {
        const response = await this.pterodactyl.request(
            `/api/application/nodes/${nodeId}/allocations?per_page=2000`,
            'GET'
        );

        return response;
    }

    async getNodes() {
        const response = await this.pterodactyl.request(
            '/api/application/nodes',
            'GET'
        );

        return response;
    }

    async getServers(nodeId) {
        const response = await this.pterodactyl.request(
            `/api/application/nodes/${nodeId}?include=servers`,
            'GET'
        );

        return response;
    }
}