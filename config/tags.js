const MiscConfigs = require("../../config/misc-configs.js");

const tags = {
  command: `Hey! Please only run your commands in <#${MiscConfigs.normalCommands}>, <#${MiscConfigs.donatorCommands}> or <#${MiscConfigs.betaCommands}>`,
  504: "`Error 504` means that the wings are currently down. This is nothing you can change.\nPlease be patient and wait for Dan to fix it.",
};

module.exports = tags;
