const { EmbedBuilder, Colors } = require("discord.js");
const UserSchema = require("../../../utils/Schemas/User");
const config = require('../../../config.json');
const bycrypt = require('bcrypt');

module.exports = function (fastify, opts, done) {

    // Removing cache control for each request
    fastify.addHook("onRequest", async (req, res) => {
		res.headers({
			"Cache-Control": "no-store, max-age=0, must-revalidate",
			Expires: "0",
			Pragma: "no-cache",
			"Surrogate-Control": "no-store",
		});
	});

	fastify.delete('/:userId', async (req, res) => {
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

		const password = req.body.password;

		if (!password) {
			code = 400;
			res.code(code).send({
				error: {
					name: 'Missing',
					message: 'Missing keys: password',
					statusCode: code
				}
			});
			return;
		}


		const userId = req.params.userId;
		let user = await UserSchema.findOneAndDelete({ userId: userId });
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

		if (bycrypt.compare(password, user.password)) {
			code = 403;
			res.code(code).send({
				error: {
					name: 'Forbidden',
					message: `Password does not match`,
					statusCode: code
				}
			});
			return;
		}

		let pteroData = await opts.ptero.userDetails(userId);
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
		await opts.ptero.deleteUser(userId);

		const logEmbed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle("User Deleted")
			.setDescription('Webserver has deleted an account!')
			.addFields({ name: "User ID", value: userId })

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