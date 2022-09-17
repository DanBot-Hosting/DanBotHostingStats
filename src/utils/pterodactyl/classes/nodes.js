module.exports = class nodeClass {
    constructor(pterodactyl) {
        this.getAllocations = async nodeId => {
            const response = await pterodactyl.request(
                `/api/application/nodes/${nodeId}/allocations?per_page=2000`,
                'GET'
            );
            return response;
        }
        this.getNodes = async () => {
            const response = await pterodactyl.request(
                '/api/application/nodes',
                'GET'
            );
            return response;
        }
        this.getServers = async nodeId => {
            const response = await pterodactyl.request(
                `/api/application/nodes/${nodeId}?include=servers`,
                'GET'
            );
            return response;
        }
    }
}