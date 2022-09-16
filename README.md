# Webserver for DBH bot rewrite

3 more dependencies: `fastify`, `pino-pretty`, `tiny-glob`

Added custom logger via pino-pretty similar to DarkerInk's

Includes route handler from `src/webserver/routeHandler.js` for `src/webserver/routes`

Includes Content-Type parser from `src/webserver/typeParser.js` for route handler