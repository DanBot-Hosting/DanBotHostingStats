module.exports = class userClass {
    constructor(pterodactyl) {
        this.createUser = async data => {
            const response = await pterodactyl.request(
                '/api/application/users',
                'POST',
                data
            );
            return response;
        }
        this.deleteUser = async userId => {
            const response = await pterodactyl.request(
                `/api/application/users/${userId}`,
                'DELETE'
            );
            return response.data.attributes;
        }
        this.userDetails = async userId => {
            const response = await pterodactyl.request(
                `/api/application/users/${userId}`,
                'GET'
            );
            return response.data.attributes;
        }
        this.fetchUsers = async () => {
            const response = await pterodactyl.request(
                '/api/application/users',
                'GET'
            );
            if (response.error) return response;
            return response.data.data.map(user => {
                return {
                    id: user.attributes.id,
                    uuid: user.attributes.uuid,
                    username: user.attributes.username,
                    email: user.attributes.email,
                    firstName: user.attributes.first_name,
                    lastName: user.attributes.last_name,
                    createdAt: user.attributes.created_at,
                    updatedAt: user.attributes.updated_at,
                }
            });
        }
        this.resetPassword = async (userData, password) => {
            const response = await pterodactyl.request(
                `/api/application/users/${userData.id}`,
                'PATCH',
                {
                    email: userData.email,
                    username: userData.username,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    language: 'en',
                    password: password
                }
            );
            return response.data;
        }
        this.updateUser = async (userId, data) => {
            const user = await this.userDetails(userId);
            const response = await pterodactyl.request(
                `/api/application/users/${userId}`,
                'PATCH',
                {
                    email: data.email ?? user.email,
                    username: data.username ?? user.username,
                    first_name: data.first_name ?? user.first_name,
                    last_name: data.last_name ?? user.last_name,
                    language: data.language ?? user.language,
                    root_admin: data.root_admin ?? user.root_admin,
                    password: data.password ?? '',
                    external_id: data.external_id ?? user.external_id
                }
            );
            return response;
        }
    }
}