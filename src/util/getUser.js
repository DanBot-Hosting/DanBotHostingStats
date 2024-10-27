const axios = require("axios");
const Config = require("../../config.json");

/**
 * Fetches user data from Pterodactyl.
 *
 * @param {BigInt} email - The user email to fetch data for.
 * @returns {Promise<Object>} - The response data.
 */
module.exports = async function (email) {
  try {
    const response = await axios({
      url: `${Config.Pterodactyl.hosturl}/api/application/users?filter[email]=${email}`,
      method: "GET",
      followRedirect: true,
      maxRedirects: 5,
      headers: {
        Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
        "Content-Type": "application/json",
        Accept: "Application/vnd.pterodactyl.v1+json",
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.status
      : error.request
      ? error.request
      : error.message;
    console.error("[REQUEST] Error fetching user: " + errorMessage);
    throw error;
  }
};
