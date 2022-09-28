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
    
	fastify.post('/', async (req, res) => {
		let code = 200;

		// Required keys
		const keys = ['email', 'username', 'password', 'firstName', 'lastName'];
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
		const salt = await bycrypt.genSalt(10);
		const hashedEmail = await bycrypt.hash(body.email, salt);

		const user = await UserSchema.findOne({ username: body.username });

		if (user) {
			code = 400;
            res.code(code).send({
				error: {
					name: 'AlreadyExists',
					message: 'Account with that username already exists!',
					statusCode: code
				}
			});
            return;
        }

		const password = passwordGen(12);
		const hashedPassword = await bycrypt.hash(password, salt);

		const resData = await opts.ptero.user.createUser({
			username: body.username,
			first_name: body.firstName,
			last_name: body.lastName,
			email: body.email,
			password: body.password,
			isAdmin: false,
			language: "en",
			externalId: undefined
		});

		if (resData.error) {
			code = 500;
			return res.code(code).send({
				error: {
					name: 'Failed',
					message: 'Account creation failed!',
					statusCode: code,
					errors: resData.data.errors
				}
			});
		}

		const data = {
			consoleId: resData.data.attributes.id,
			email: hashedEmail,
			password: hashedPassword,
			username: body.username,
			domains: [],
			linkDate: null
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
			data: {
				consoleId: resData.data.attributes.id,
				email: body.email,
				username: body.username.toLowerCase(),
			},
			statusCode: code
		});
	});

    done();
}