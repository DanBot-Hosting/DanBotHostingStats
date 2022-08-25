module.exports = function (fastify, opts, next) {

    // Removing cache control for each request
    fastify.addHook("onRequest", async (req, res) => {
		res.headers({
			"Cache-Control": "no-store, max-age=0, must-revalidate",
			Expires: "0",
			Pragma: "no-cache",
			"Surrogate-Control": "no-store",
		});
	});
    
    next();
}