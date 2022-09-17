module.exports = class serverClass {
    constructor(pterodactyl) {
        this.createServer = async data => {
            const response = await pterodactyl.request(
                `/api/application/servers`,
                'POST',
                data
            );
            return response;
        }
        this.deleteServer = async serverId => {
            const response = await pterodactyl.request(
                `/api/application/servers/${serverId}/force`,
                'DELETE'
            );
            return response;
        }
        this.servers = async consoleId => {
            const response = await pterodactyl.request(
                `/api/application/users/${consoleId}?include=servers`,
                'GET'
            );
            return response;
        }
    }
}