const path = require('node:path');

module.exports = async (fastify, opts, done) => {
    let files = await require('tiny-glob')('./src/webserver/routes/**/*.js');
    
    files.forEach(file => {
        let posix = file.split(path.sep).join(path.posix.sep);
        // posix formatted route
        // from "src\\webserver\\routes\\example\\fetch.index.js"
        // to "src/webserver/routes/example/fetch.index.js"

        let replacedPrefix = posix.replace(/^src\/webserver\/routes(.*)$/g, '$1');
        // general prefix name
        // removes the src/webserver/routes from the string

        let prefix = replacedPrefix;
        if (path.basename(file) === 'index.js' || path.basename(file).match(/.*\.index\.js/g)) {
            prefix = path.dirname(prefix);
            // turn /example/nesting/fetch.index.js
            // and /example/nesting/index.js
            // to /example/nesting
        } else {
            prefix = prefix.replace(/\.[^/.]+$/, "")
            // turn /example/nesting.js
            // to /example/nesting
        }

        const route = require(path.resolve(file));
        fastify.register(route, {
            path: replacedPrefix,
            prefix: prefix,
            client: opts.client,
            pteroApp: opts.pteroApp,
            pteroClient: opts.pteroClient
        });
    });
    done();
};