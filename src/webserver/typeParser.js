// Used to handle most of the FastifyError related to application/json Content-Type
// Instead of using fastify's json parser it uses JSON.parse() function: line 20
module.exports = (fastify) => {
    fastify.addContentTypeParser('application/json', { parseAs: 'string' },
        (req, body, done) => {
            if (!body) {
                return done({
                    name: "Missing",
                    message: "Body cannot be empty when content-type is set to 'application/json'",
                    statusCode: 400
                }, undefined);
            }
            let json;
            try {
                json = JSON.parse(body);
            } catch (err) {
                err.statusCode = 400;
                console.log(err);
                return done(err, undefined);
            }
            done(null, json);
        }
    );
};