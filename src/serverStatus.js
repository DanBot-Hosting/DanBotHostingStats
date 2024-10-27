const axios = require("axios");
const ping = require("ping-tcp-js");
const Discord = require("discord.js");
const Config = require("../config.json");
const Status = require("../config/status-configs.js");

const safePromise = async (promise) => {
  try {
    const rp = await promise;
    return [rp, null];
  } catch (e) {
    return [null, e];
  }
};

const updateNodeStatus = async (node, isOnline, isVmOnline) => {
  await nodeStatus.set(`${node}.timestamp`, Date.now());
  await nodeStatus.set(`${node}.status`, isOnline);
  await nodeStatus.set(`${node}.is_vm_online`, isVmOnline);
};

const checkNodeStatus = async (node, data) => {
  const [, fetchError] = await safePromise(
    axios({
      url: `${Config.Pterodactyl.hosturl}/api/client/servers/${data.serverID}/resources`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${Config.Pterodactyl.apikeyclient}`,
        "Content-Type": "application/json",
        Accept: "Application/vnd.pterodactyl.v1+json",
      },
    })
  );

  if (fetchError) {
    const [, pingError] = await safePromise(ping.ping(data.IP, 22));
    if (pingError) {
      await updateNodeStatus(node, false, false);
    } else {
      await updateNodeStatus(node, false, true);
    }
  } else {
    await updateNodeStatus(node, true, true);
  }
};

const checkServiceStatus = async (name, data) => {
  const [, error] = await safePromise(ping.ping(data.IP, 22));
  await nodeStatus.set(`${name}.timestamp`, Date.now());
  await nodeStatus.set(`${name}.status`, !error);
};

const startNodeChecker = () => {
  setInterval(async () => {
    for (const [, nodes] of Object.entries(Status.Nodes)) {
      for (const [node, data] of Object.entries(nodes)) {
        await checkNodeStatus(node, data);

        const [serverCountRes, serverCountError] = await safePromise(
          axios({
            url: `${Config.Pterodactyl.hosturl}/api/application/nodes/${data.ID}/allocations?per_page=9000`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
              "Content-Type": "application/json",
              Accept: "Application/vnd.pterodactyl.v1+json",
            },
          })
        );

        if (!serverCountError && serverCountRes) {
          const serverCount = serverCountRes.data.data.filter(
            (m) => m.attributes.assigned
          ).length;

          await nodeServers.set(`${node}`, {
            servers: serverCount,
            maxCount: serverCountRes.data.meta.pagination.total,
          });
        }
      }
    }

    for (const [category, services] of Object.entries(Status)) {
      if (category !== "Nodes") {
        for (const [name, data] of Object.entries(services)) {
          await checkServiceStatus(name, data);
        }
      }
    }
  }, 30 * 1000);
};

const parseStatus = async () => {
  const toReturn = {};

  // Handle Nodes categories.
  for (const [category, nodes] of Object.entries(Status.Nodes)) {
    const temp = [];
    for (const [nodeKey, data] of Object.entries(nodes)) {
      const nodeStatusData = await nodeStatus.get(nodeKey.toLowerCase());
      const nodeServerData = await nodeServers.get(nodeKey.toLowerCase());

      const serverUsage = (await nodeServerData)
        ? `(${nodeServerData.servers} / ${nodeServerData.maxCount})`
        : "";

      let statusText;
      if (nodeStatusData?.maintenance) {
        statusText = `🟣 Maintenance ~ Returning Soon!`;
      } else if (nodeStatusData?.status) {
        statusText = `🟢 Online ${serverUsage}`;
      } else if (nodeStatusData?.is_vm_online == null) {
        statusText = "🔴 **Offline**";
      } else {
        statusText =
          (nodeStatusData.is_vm_online ? "🟠 **Wings**" : "🔴 **System**") +
          ` **offline** ${serverUsage}`;
      }

      temp.push(`${data.Name}: ${statusText}`);
    }
    toReturn[category] = temp;
  }

  // Handle other categories.
  for (const [category, services] of Object.entries(Status)) {
    if (category !== "Nodes") {
      const temp = [];
      for (const [name, data] of Object.entries(services)) {
        const serviceStatusData = await nodeStatus.get(name.toLowerCase());

        const statusText = serviceStatusData?.status
          ? "🟢 Online"
          : "🔴 **Offline**";

        temp.push(`${data.name}: ${statusText}`);
      }
      toReturn[category] = temp;
    }
  }

  return toReturn;
};

const getEmbed = async () => {
  const status = await parseStatus();
  let desc = "";

  for (const [title, d] of Object.entries(status)) {
    desc = `${desc}***${title}***\n${d.join("\n")}\n\n`;
  }

  const embed = new Discord.EmbedBuilder();

  embed.setTitle("DBH Service Status");
  embed.setDescription(desc);
  embed.setTimestamp();
  embed.setColor("#7388d9");
  embed.setFooter({ text: "Last Updated" });

  return embed;
};

module.exports = { startNodeChecker, parseStatus, getEmbed };
