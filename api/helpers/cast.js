'use strict';
const _ = require('lodash');

module.exports = (object, type) => {

    switch (type) {

        case 'agent':
            if (typeof object.useWebhook !== 'boolean'){
                object.useWebhook = object.useWebhook === 'true';
            }
            object.domainClassifierThreshold = parseFloat(object.domainClassifierThreshold);
            break;
        case 'context':
            break;
        case 'domain':
            if (typeof object.enabled !== 'boolean'){
                object.enabled = object.enabled === 'true';
            }
            object.intentThreshold = parseFloat(object.intentThreshold);
            break;
        case 'entity':
            break;
        case 'intent':
            if (typeof object.useWebhook !== 'boolean'){
                object.useWebhook = object.useWebhook === 'true';
            }
            object.examples = object.examples.map((example) => {

                if (example.entities === '') {
                    example.entities = [];
                }
                else {
                    example.entities = example.entities.map((entity) => {

                        if (entity.entityId) {
                            entity.entityId = parseInt(entity.entityId);
                        }
                        entity.start = parseInt(entity.start);
                        entity.end = parseInt(entity.end);
                        return entity;
                    });
                }
                return example;
            });
            break;
        case 'scenario':
            if (object.slots === '') {
                object.slots = [];
            }
            else {
                object.slots = object.slots.map((slot) => {

                    if (!_.isArray(slot.textPrompts)) {
                        slot.textPrompts = [];
                    }
                    if (typeof object.isList !== 'boolean'){
                        slot.isList = slot.isList === 'true';
                    }
                    if (typeof object.isRequired !== 'boolean'){
                        slot.isRequired = slot.isRequired === 'true';
                    }
                    return slot;
                });
            }
            if (object.intentResponses === '') {
                if (object.intentResponses.length === 0) {
                    object.intentResponses = [];
                }
            }
            break;
        case 'webhook':
            break;
    }
    ;
    if (object.id) {
        object.id = parseInt(object.id);
    }
    return object;
};
