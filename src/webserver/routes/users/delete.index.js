const { EmbedBuilder, Colors } = require("discord.js");
const UserSchema = require("../../../utils/Schemas/User");
const config = require('../../../config.json');
const bycrypt = require('bcrypt');

module.exports = (fastify, opts, done) => {

    // Removing cache control for each request
    fastify.addHook("onRequest", async (req, res) => {
        res.headers({
            "Cache-Control": "no-store, max-age=0, must-revalidate",
            Expires: "0",
            Pragma: "no-cache",
            "Surrogate-Control": "no-store",
        });
    });

    fastify.delete('/:username', async (req, res) => {
        const username = req.params.username;

        let code = 200;
        if (!req.body) {
            code = 400;
            res.code(code).send({
                error: {
                    name: "Missing",
                    message: "Body cannot be empty when content-type is set to 'application/json'",
                    statusCode: code
                }
            });
        }

        const user = await UserSchema.findOne({ username });
        console.log(username, user)
        const { email, password } = req.body;
        
        if (!user) {
            code = 404;
            res.code(code).send({
                error: {
                    name: 'NotFound',
                    message: `Account can not be found in: database`,
                    statusCode: code
                }
            });
            return;
        }

        if (!(await bycrypt.compare(email, user.email))) {
            code = 400;
            res.code(code).send({
                error: {
                    name: 'NoMatch',
                    message: 'Email does not match',
                    statusCode: code
                }
            });
            return;
        }

        if (!bycrypt.compare(password, user.password)) {
            code = 400;
            res.code(code).send({
                error: {
                    name: 'NoMatch',
                    message: 'Password does not match',
                    statusCode: code
                }
            });
            return;
        }

        await user.delete();

        let pteroData = await opts.ptero.user.userDetails(user.consoleId);
        if (!pteroData) {
            code = 404;
            res.code(code).send({
                error: {
                    name: 'NotFound',
                    message: `Account can not be found in: pterodactyl`,
                    data: {
                        db: user,
                        pterodactyl: {}
                    },
                    statusCode: code
                }
            });
            return;
        }
        await opts.ptero.user.deleteUser(user.consoleId);

        const logEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("User Deleted")
            .setDescription('Webserver has deleted an account!')
            .addFields({ name: "Console ID", value: user.consoleId })

        const logChan = opts.client.channels.cache.get(config.discord.channels.userLogs);

        if (logChan) {
            logChan.send({ embeds: [logEmbed] })
        }

        res.code(code).send({
            db: user,
            pterodactyl: pteroData
        });
    });

    done();
}