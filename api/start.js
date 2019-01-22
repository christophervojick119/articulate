'use strict';

const Server = require('./index');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiSwaggerUI = require('hapi-swaggered-ui');
const FlowLoader = require('./plugins/flow-loader.plugin');
const Redis = require('./plugins/redis.plugin');
const InitDefaultSettings = require('./plugins/init-default-settings.plugin');
const Pack = require('./package');
const Nes = require('nes');

Server((err, server) => {

    if (err) {
        console.error(err);
        console.log('process.exit(1)');
        return process.exit(1);
    }

    const swaggerOptions = {
        info: {
            title: 'Articulate API Documentation',
            version: Pack.version,
            contact: {
                name: 'Smart Platform Group'
            }
        },
        documentationPage: false
    };

    process.env.SWAGGER_SCHEMES ? swaggerOptions.schemes = [process.env.SWAGGER_SCHEMES] : null;
    process.env.SWAGGER_HOST ? swaggerOptions.host = process.env.SWAGGER_HOST : null;
    process.env.SWAGGER_BASE_PATH ? swaggerOptions.basePath = process.env.SWAGGER_BASE_PATH : null;
    // We added in HapiSwaggerUI because HapiSwagger hadn't been updated and had an SSL bug.
    const swaggerUIOptions = {
        title: 'Articulate API Documentation',
        path: '/documentation',
        swaggerOptions: {
            validatorUrl: false
        },
        authorization: false
    };

    const flowLoaderOptions = {
        baseDir: __dirname,
        cache: false,
        discover: true
    };

    const redisOptions = {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
        retry: process.env.INIT_RETRY || 10,
        retryTimeout: process.env.INIT_RETRY_TIMEOUT || 15000
    };

    // We have to specify a swaggerEndpoint since we use hapi-swaggered-ui with hapi-swagger. It can't auto find the swagger.json
    // to work behind a reverse proxy path we need to build the endpoint from the basePath when it is provided.
    // All of this is specifically to get the swagger docs working.
    process.env.SWAGGER_BASE_PATH ? swaggerUIOptions.swaggerEndpoint = process.env.SWAGGER_BASE_PATH + '/swagger.json' : swaggerUIOptions.swaggerEndpoint = '/swagger.json';
    process.env.SWAGGER_BASE_PATH ? swaggerUIOptions.basePath = process.env.SWAGGER_BASE_PATH : null;

    server.register([
        Nes,
        Inert,
        Vision,
        { 'register': HapiSwagger, 'options': swaggerOptions },
        { 'register': HapiSwaggerUI, 'options': swaggerUIOptions },
        { 'register': FlowLoader, 'options': flowLoaderOptions },
        { 'register': Redis, 'options': redisOptions },
        { 'register': InitDefaultSettings, 'options': {} }
    ], (err) => {

        if (err) {
            console.log(err);
        }

        server.subscription('/agent/{id}');
        server.start((errStart) => {

            if (errStart) {
                console.log(errStart);
            }
            else {
                console.log('Server running.');
            }
        });
    });
});
