const { EmbedBuilder, Colors } = require("discord.js");
const UserSchema = require("../../../utils/Schemas/User");
const updateUser = require('../../../utils/pterodactyl/user/update');
const bycrypt = require("bcrypt");
const config = require('../../../config.json');

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

	fastify.put('/:userId', async (req, res) => {
		let code = 200;

		// Required keys
		const keys = ['username', 'firstName', 'lastName', 'email', 'password'];

		// Find missing keys
		let missingKeys = [];
		keys.forEach(item => {
			if (!req.body.hasOwnProperty(item)) missingKeys.push(item);
		});

		// Check if all keys are there
		if (missingKeys.length) {
			code = 400;
			res.code(code).send({
				error: {
					name: 'Missing',
					message: `Missing keys: ${missingKeys.join(', ')}`,
					data: missingKeys,
					statusCode: code
				}
			});
			return;
		}

		const body = req.body;
		const userId = req.params.userId;

		const user = await UserSchema.findOne({ userId: userId });
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

		if (bycrypt.compare(body.password, user.password)) {
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

		const salt = config.pterodactyl.salt;

		const emailhash = await bycrypt.hash(body.email, salt);
		const passwordhash = await bycrypt.hash(body.password, salt);

		const resData = await updateUser(userId, {
			username: body.username.toLowerCase(),
			first_name: body.userTag,
			last_name: userId,
			email: body.email,
			password: body.password,
			language: "en",
		});

		if (resData.error) {
			code = 400;
			return res.code(code).send({
				error: {
					name: 'EpicFail',
					message: 'Could not update an account!',
					data: resData.data,
					statusCode: code
				}
			});
		}

		const userNew = await UserSchema.findOneAndUpdate({ userId: userId }, {
			username: body.username.toLowerCase(),
			email: emailhash,
			password: passwordhash
		});

		const logEmbed = new EmbedBuilder()
			.setColor(Colors.Green)
			.setTitle("User Updated")
			.setDescription('Webserver has updated an account!')

		if (user.username !== userNew.username) {
			logEmbed.addFields(
				{name: "Old Username", value: user.username},
				{name: 'New Username', value: userNew.username}
			);
		} else {
			logEmbed.addFields({name: "Username", value: user.username});
		}

		const logChan = opts.client.channels.cache.get(config.discord.channels.userLogs);

		if (logChan) {
			logChan.send({ embeds: [logEmbed] })
		}

		res.code(code).send({
			data: resData.data,
			statusCode: code
		});
	});

	done();
}