# Webserver for DBH bot rewrite

3 more dependencies: `fastify`, `jspteroapi`, `pino-pretty`, `tiny-glob`

Added custom logger via pino-pretty similar to DarkerInk's

Includes route handler from `src/webserver/routeHandler.js` for `src/webserver/routes`

Includes Content-Type parser from `src/webserver/typeParser.js` for route handler

## src/commands/user

Won't remove the folder for future Dibster's tests

## `jspteroapi`

Docs:
- [Application](https://jspteroapi.linux123123.com/classes/index.Application.html)
- [Client](https://jspteroapi.linux123123.com/classes/index.Client.html)