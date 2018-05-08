'use strict';
const _ = require('lodash');
const Boom = require('boom');
const Async = require('async');

const systemEntities = ['sys.spacy_money', 'sys.spacy_quantity', 'sys.spacy_cardinal', 'sys.spacy_ordinal', 'sys.spacy_date', 'sys.spacy_time', 'sys.spacy_person', 'sys.spacy_norp', 'sys.spacy_org', 'sys.spacy_percent', 'sys.duckling_amount-of-money', 'sys.duckling_distance', 'sys.duckling_duration', 'sys.duckling_email', 'sys.duckling_number', 'sys.duckling_ordinal', 'sys.duckling_phone-number', 'sys.duckling_quantity', 'sys.duckling_temperature', 'sys.duckling_time', 'sys.duckling_url', 'sys.duckling_volume'];

const extractEntities = (examples) => {

    //Only system entities have an extractor specified, so ignore sys entities
    const entities = _.compact(_.uniq(_.flatten(_.map(_.filter(_.flatten(_.map(examples, 'entities')), (entity) => {

        return !entity.extractor;
    }), 'entity'))));
    return entities;
};

const validateEntities = (redis, agent, examples, cb) => {

    const usedEntities = extractEntities(examples);

    Async.forEach(usedEntities, (entity, callback) => {

        if (entity.startsWith('sys.')){
            if (systemEntities.indexOf(entity) !== -1){
                return callback(null);
            }
        }
        else {
            redis.zscore(`agentEntities:${agent}`, entity, (err, entityExist) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred checking if the entity exists.');
                    return callback(error);
                }
                if (entityExist){
                    return callback(null);
                }
                const error = Boom.badRequest(`The entity with the name ${entity} doesn't exist in the agent ${agent}`);
                return callback(error);
            });
        }
    }, (err) => {

        if (err){
            return cb(err);
        }
        return cb(null);
    });
};

module.exports = validateEntities;
