const { EmbedBuilder, Colors } = require("discord.js");
const UserSchema = require("../../../utils/Schemas/User");
const bycrypt = require("bcrypt");
const config = require('../../../config.json');

const passwordGen = (length) => {
    const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }

    return password;
}

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
    
	fastify.post('/:userId', async (req, res) => {
		let code = 200;

		// Required keys
		const keys = ['email', 'username', 'userTag'];

		// Find missing keys
		let missingKeys = [];
		keys.forEach(item => {
			if (req.body.hasOwnProperty(item)) missingKeys.push(item);
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

		if (user) {
			code = 400;
            res.code(code).send({
				error: {
					name: 'AlreadyExists',
					message: 'Account already exists!',
					statusCode: code
				}
			});
            return;
        }

		const salt = config.pterodactyl.salt;
		const password = passwordGen(12);

        const emailhash = await bycrypt.hash(body.email, salt);
		const passwordhash = await bycrypt.hash(password, salt);

        const emailCheck = await UserSchema.findOne({ email: emailhash });
        const usernameCheck = await UserSchema.findOne({ username: body.username });

        if (emailCheck) {
			code = 400;
            res.code(code).send({
				error: {
					name: 'AlreadyExists',
					message: 'That email is already in use!',
					statusCode: code
				}
			});
            return;
        }

        if (usernameCheck) {
			code = 400;
            res.code(code).send({
				error: {
					name: 'AlreadyExists',
					message: 'That username is already in use!',
					statusCode: code
				}
			});
            return;
        }

		const resData = await opts.ptero.createUser({
			username: body.username.toLowerCase(),
			firstName: body.userTag,
			lastName: userId,
			email: body.email,
			password: password,
			isAdmin: false,
			language: "en",
			externalId: undefined
		});

		if (resData.error) {
			code = 400;
			return res.code(code).send({
				error: {
					name: 'EpicFail',
					message: 'Account creation failed!',
					data: resData.data,
					statusCode: code
				}
			});
		}

		const linkDate = Date.now();
		const data = {
			userId: userId,
			consoleId: resData.data.attributes.id,
			email: emailhash,
			password: passwordhash,
			username: body.username.toLowerCase(),
			domains: [],
			linkDate: linkDate,
		}
		await UserSchema.create(data);

		const logEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("User Created")
            .setDescription('Webserver has created an account!')
            .addFields({ name: "Username", value: body.username })

        const logChan = opts.client.channels.cache.get(config.discord.channels.userLogs);

        if (logChan) {
            logChan.send({ embeds: [logEmbed] })
        }

		res.code(code).send({
			data: data,
			statusCode: code
		});
	});

    done();
}