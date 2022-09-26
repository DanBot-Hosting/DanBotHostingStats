module.exports = class serverClass {
    constructor(pterodactyl) {
        this.pterodactyl = pterodactyl;
    }

    async createServer(data) {
        const response = await this.pterodactyl.request(
            `/api/application/servers`,
            'POST',
            data
        );

        return response;
    }

    async deleteServer(serverId) {
        const response = await this.pterodactyl.request(
            `/api/application/servers/${serverId}/force`,
            'DELETE'
        );

        return response;
    }

    async servers(consoleId) {
        const response = await this.pterodactyl.request(
            `/api/application/users/${consoleId}?include=servers`,
            'GET'
        );

        return response;
    }
}