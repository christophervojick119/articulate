'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('intent:' + intentId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the intent.');
            return reply(error);
        }
        if (data){
            return reply(null, Flat.unflatten(data));
        }
        const error = Boom.notFound('The specified intent doesn\'t exists');
        return reply(error);
    });

};
