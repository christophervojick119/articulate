'use strict';

const Joi = require('joi');
class SlotModel {
    static get schema() {

        return {
            slotName: Joi.string().trim(),
            uiColor: Joi.string().trim(),
            keywordId: Joi.number(),
            keyword: Joi.string().trim(),
            isList: Joi.boolean(),
            isRequired: Joi.boolean(),
            textPrompts: Joi.array().items(Joi.string().trim())
        };
    };
}

module.exports = SlotModel;
