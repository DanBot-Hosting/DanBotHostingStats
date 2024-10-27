const {
  Pterodactyl: { hosturl, apikey },
} = require("../../config.json");

module.exports = function (Endpoint) {
  return {
    url: hosturl + Endpoint,
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + apikey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};
