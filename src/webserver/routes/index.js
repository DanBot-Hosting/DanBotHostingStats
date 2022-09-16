module.exports = function (fastify, opts, done) {

	fastify.get('/', (req, res) => {
		let code = 200;
		res.code(code).send({
			data: 'Nothing in there yet',
			statusCode: code
		})
	});
    
    done();
}