const { Client } = require("discord.js");
const chalk = require("chalk");
const path = require("node:path");
const fs = require("node:fs");

/**
 * @param {Client} client 
 */
const commandLoader = (client) => {
    const filePath = fs.readdirSync(path.join(__dirname, "../commands"));

    for (const file of filePath) {
        const stats = fs.statSync(path.join(__dirname, "../commands", file));

        if (stats.isDirectory()) {
            const dirfiles = fs.readdirSync(path.join(__dirname, "../commands", file)).filter(f => f.endsWith(".js"));

            for (const dirfile of dirfiles) {
                const command = require(path.join(__dirname, "../commands", file, dirfile));

                if (client.commands.has(file)) {
                    const cmds = client.commands.get(file);
                    if (cmds.find(c => c.name === command.name)) {
                        throw new Error(`Command '${command.name}' already exists in '${file}'`);
                    } else {
                        client.commands.get(file).push(command);
                    }
                } else {
                    client.commands.set(file, [command]);
                }

                console.log(`${chalk.green("Loaded")} ${chalk.cyan("Subcommand")} ${chalk.blue(command.name)} from ${chalk.cyan(file)}`);
            }
        } else {
            const command = require(path.join(__dirname, "../commands", file));

            if (client.commands.has(command.name)) {
                throw new Error(`Command '${command.name}' already exists`);
            }

            client.commands.set(command.name, command);

            console.log(`${chalk.green("Loaded")} ${chalk.cyan("Command")} ${chalk.blue(command.name)}`);
        }
    }
}

module.exports = commandLoader;