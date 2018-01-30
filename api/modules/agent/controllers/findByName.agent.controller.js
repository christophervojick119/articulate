'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const agentName = request.params.agentName;
    const redis = request.server.app.redis;

    redis.zscore('agents', agentName, (err, agentId) => {

        if (err){
            const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
            return reply(error);
        }
        if (agentId){
            redis.hgetall('agent:' + agentId, (err, data) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred retrieving the agent.');
                    return reply(error);
                }
                if (data){
                    return reply(null, Flat.unflatten(data));
                }
                const error = Boom.notFound('The specified agent doesn\'t exists');
                return reply(error);
            });
        }
        else {
            const error = Boom.badRequest(`The agent "${agentName}" doesn't exist`);
            return reply(error, null);
        }
    });

};
