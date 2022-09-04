const UserSchema = require("../../../utils/Schemas/User");
const config = require('../../../config.json')
const ptero = require('jspteroapi');
const application = new ptero.Application(config.pterodactyl.panelUrl, config.pterodactyl.adminKey);

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
    
	fastify.get('/:userId', async (req, res) => {
		const userId = req.params.userId;
		let code = 200;

		let user = await UserSchema.findOne({ userId: userId });
		if (!user) {
			code = 404;
            user = {}
        }

		let pteroData = await application.getUserInfo(userId);
		if (!pteroData) {
			code = 404;
			pteroData = {}
        }

		res.code(code).send({
			db: user,
			pterodactyl: pteroData,
			statusCode: code
		});
	});

    done();
}