const { white } = require('chalk');
const webConfig = require('./website-config.json');
const config = require('./config.json');
const ptero = require('jspteroapi');
const pteroApp = new ptero.Application(config.pterodactyl.panelUrl, config.pterodactyl.adminKey);
const pteroClient = new ptero.Client(config.pterodactyl.panelUrl, config.pterodactyl.adminKey);
const logger = webConfig.log.logger ? {
    transport: {
        target: './webserver/logger',
        options: {}
    }
} : false;
const fastify = require('fastify')({
    logger: logger,
    disableRequestLogging: !webConfig.log.logRequestsResponse,
    ...webConfig.fastifyOptions
});

module.exports = client => {
    // Logging registered paths in console
    fastify.addHook('onRegister', (instance, opts) => {
        if (opts.prefix && opts.path) {
            fastify.log.info(`Registered route ${white(opts.prefix)} on path ${white(opts.path)}`);
        }
    });

    // Content-Type parser won't work if you register it via fastify
    require('./webserver/typeParser')(fastify);
    fastify.register(require('./webserver/routeHandler'), {
        client: client,
        pteroApp: pteroApp,
        pteroClient: pteroClient
    });

    fastify.register((instance, opts, done) => {
        instance.setNotFoundHandler((req, res) => {
            // Setting not found handler
            // Can be called by res.callNotFound()
            fastify.log.warn('User hit non-existing route');

            res.code(404).send({
                error: {
                    name: 'NotFound',
                    message: `Account can not be found in: database`,
                    statusCode: 404
                }
            });
        });

        done();
    });

    // Handle fastify errors without crashing
    fastify.setErrorHandler((err, req, res) => {
        if (!err) return;

        // Log error in an error state
        fastify.log.error(err);

        // Send error response
        res.send({
            error: err,
        });
    });

    fastify.listen(webConfig.listenOptions, err => {
        if (err) throw err;
    });
}