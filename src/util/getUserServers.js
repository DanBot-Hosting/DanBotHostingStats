const axios = require("axios");
const Config = require("../../config.json");

/**
 * Fetches user data from Pterodactyl.
 *
 * @param {BigInt} userId - The user ID to fetch data for.
 * @returns {Promise<Object>} - The response data.
 */
module.exports = async function (userId) {
  try {
    const { hosturl, apikey } = Config.Pterodactyl;
    const url = `${hosturl}/api/application/users/${userId}?include=servers`;

    const response = await axios({
      url,
      method: "GET",
      followRedirect: true,
      maxRedirects: 5,
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        Accept: "Application/vnd.pterodactyl.v1+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("[REQUEST] Error fetching user servers:", error);
    throw error;
  }
};
