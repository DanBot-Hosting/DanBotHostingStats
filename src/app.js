const { white } = require('chalk');
const config = require('./website-config.json');
const logger = config.log.logger ? {
    transport: {
        target: './webserver/logger',
    }
} : false;
const fastify = require('fastify')({
    logger: logger,
    ignoreTrailingSlash: true,
    disableRequestLogging: !config.log.logRequestsResponse
});

fastify.addHook('onRegister', (instance, opts) => {
    if (!opts.prefix) return;
    fastify.log.info(`Registered path ${white(opts.prefix)}`);
});

fastify.register(require('./webserver/routeHandler'));

fastify.get('*', (req, res) => {
    res.code(200).send({ responseCode: 200 });
});

fastify.listen({ port: config.port, host: config.address }, err => {
    if (err) throw err;
});