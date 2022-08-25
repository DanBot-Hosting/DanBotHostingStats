const path = require('node:path');

module.exports = async (fastify, opts, done) => {
    let files = await require('tiny-glob')('./src/webserver/routes/**/*.js');
    
    files.forEach(file => {
        let posix = file.split(path.sep).join(path.posix.sep);
        // posix formatted route
        // from "src\\webserver\\routes\\example\\index.js"
        // to "src/webserver/routes/example/index.js"

        let prefix = posix.replace(/^src\/webserver\/routes(.*)$/g, '$1');
        // general prefix name
        // removes the src/webserver/routes from the string

        if (path.basename(file) == 'index.js') {
            prefix = path.dirname(prefix);
            // turn /example/nesting/index.js
            // to /example/nesting
        } else {
            prefix = prefix.replace(/\.[^/.]+$/, "")
            // turn /example/nesting.js
            // to /example/nesting
        }

        let route = require(path.resolve(file));
        fastify.register(route, {
            prefix: prefix
        });
    });
    done();
};