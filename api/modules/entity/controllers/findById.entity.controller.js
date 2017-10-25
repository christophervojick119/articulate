'use strict';
const debug = require('debug')('nlu:model:Entity:findById');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.get({
        index: 'entity',
        type: 'default',
        id: request.params.id
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search entity: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const entity = {};
        entity._id = response._id;
        Object.assign(entity, response._source);

        return reply(null, entity);
    });

};
